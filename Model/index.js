const mongoose = require("mongoose");

const DB_URL = process.env.DEV_DB_URL;
const ATLAS_URL = process.env.ATLAS_URL;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtpro")
  .then((data) => {
    console.log("connected to Mongo Database");
  })
  .catch((err) => {
    console.log(err);
  });
