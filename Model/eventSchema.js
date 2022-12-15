const mongoose = require("mongoose");
const { Schema , model } = mongoose;


const eventSchema = new Schema({
  name:{
    type:String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true,
  },
  date:{
    type:String,
    required: true
  },
  time:{
    type: String,
    required: true
  },
  eventType: {
    type:String,
    enum:["cultural","co-curricular","Hackathon","technical"],
    required: true
  },
  contactNum:{
    type: Number,
    required: true,
  },
  image:{
    type:String,
  },
  registeredUser:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:"User",
  }
});


const Event = model("Event",eventSchema);
module.exports = Event;
