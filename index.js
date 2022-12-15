require("dotenv").config();
require("./Model/");
const cors         = require("cors");
const express      = require("express");
const cookieParser = require("cookie-parser");
const session      = require("express-session");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
  "Access-Control-Allow-Origin": "http://localhost:3000/",
  credentials: true,
}));

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "sessions",
  cookie:{
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "lax",
    secure: false,
  }
}));



// all router files are here
const authRoutes  = require("./Routes/authRoutes");
const eventRoutes = require("./Routes/event-routes");

app.use((req,res,next)=>{
  // console.log(req.session.curr_user);
  // console.log(req.session.curr_user_token);
  next();
})

app.use("/",authRoutes);
app.use("/",eventRoutes);


const PORT = process.env.DEV_PORT;

app.listen(PORT,()=>{
  console.log(`listening to PORT ${PORT}`);
})
