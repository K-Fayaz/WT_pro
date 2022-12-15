const User = require("../Model/userSchema");

module.exports = async function verify(id) {
  try {
    const user = await User.findById(id);
    if (user) {
      return user;
    } else {
      throw 1;
    }
  } catch (err) {
    if (err == 1) {
      throw "User not found";
    }
  }
};
