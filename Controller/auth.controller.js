const bcrypt = require("bcryptjs");
const MINT_SECRET = process.env.MINT_SECRET;
const jwt = require("jsonwebtoken");
const sendgrid = require("@sendgrid/mail");
const User = require("../Model/userSchema");
const sendEmail = require("../helpers/sendEmail");
const verify = require("../helpers/verifyUser");

// set sendgrid api
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const confirm_email = async (req, res) => {
  try {
    let { email } = req.body;
    console.log(email);

    // checl if the user already exists with the email
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      throw "User already exists";
    }

    const resp = await sendEmail(email);
    console.log(resp);

    req.session.email = email;

    res.status(200).json({
      message: "Email has been sent!",
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: "User Already exists",
    });
  }
};

const get_confirmation_cookie = async (req, res) => {
  try {
    let email_session = req.session.email;
    console.log(email_session);

    if (email_session) {
      res.json({
        email_session,
        isConfirmed: true,
      });
    } else {
      res.json({
        isConfirmed: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "something went wrong!",
    });
  }
};

const register_user = async (req, res) => {
  try {
    let { user, email, password } = req.body;
    console.log(req.body);

    // check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw "User already exists";
    }

    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    let newUser = new User();
    newUser.username = user;
    newUser.email = email;
    newUser.password = hashedPassword;

    await newUser.save();

    console.log(newUser);

    let payload = {
      id: newUser.id,
      email: newUser.email,
    };

    let token = await jwt.sign(payload, MINT_SECRET, {
      expiresIn: "1d",
    });
    console.log(token);

    // create a session with token and session with user details
    req.session.curr_user = newUser;
    req.session.curr_user_token = token;

    // delete the previous session
    req.session.email = null;

    res.status(200).json({
      user: newUser,
      token: token,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send("something went wrong!");
  }
};

const post_login = async (req, res) => {
  try {
    let { email, password } = req.body;
    // check if the user is available with the email
    const user = await User.findOne({ email });
    if (!user) {
      throw "1";
    }

    // if the user exists the compare passwords
    const truthy = await bcrypt.compare(password, user.password);
    if (!truthy) {
      throw "2";
    }

    // tokenize add to session
    let payload = {
      id: user._id,
      email: user.email,
    };

    const token = await jwt.sign(payload, process.env.MINT_SECRET, {
      expiresIn: "1d",
    });

    console.log(token);
    req.session.curr_user = user._id;
    req.session.curr_user_token = token;

    res.status(200).send(user);
  } catch (err) {
    if (err === "1") {
      // there is no user with given email
      return res.status(403).send("There is no user with this email!");
    }

    if (err == "2") {
      // the enterted password is wrong
      return res.status(400).send("The entered password is wrong");
    }

    res.status(400).send(err);
  }
};

const isLoggedIn = async (req, res) => {
  try {
    const curr_user = req.session.curr_user;
    const token = req.session.curr_user_token;
    console.log("User\n", curr_user);
    console.log("Token\n", token);
    if (curr_user) {
      res.status(200).json({
        user: curr_user,
        status: "logged In",
      });
    } else {
      res.status(200).json({
        user: null,
        status: "no user",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

const logout = (req, res) => {
  try {
    // set the session cookie user and token tp null
    req.session.token = null;
    req.session.curr_user = null;
    res.status(200).send("OK");
  } catch (er) {
    console.log(err);
    res.status(400).send(err);
  }
};

const verifyAuthority = async (req, res) => {
  // console.log("fetching user data");
  try {
    const { curr_user } = req.session;
    if (curr_user) {
      let user = await verify(curr_user);
      // console.log(user);
      if (user.email === process.env.ADMIN) {
        res.status(200).json({
          role: "Admin",
          admin: true,
        });
      } else {
        res.status(200).json({
          role: "User",
          admin: false,
        });
      }
    } else {
      res.status(200).json({
        role: "User",
        admin: false,
      });
    }
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
};



module.exports = {
  logout,
  isLoggedIn,
  post_login,
  confirm_email,
  register_user,
  verifyAuthority,
  get_confirmation_cookie,
};
