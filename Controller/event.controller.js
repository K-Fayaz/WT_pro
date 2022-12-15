const hDate   = require("human-date");
const hTime   = require("hour-convert");
const User    = require("../Model/userSchema");
const Event   = require("../Model/eventSchema");


const user_is_registered = async(req,res)=>{
  try{
    let { id } = req.params;
    const user = req.session.curr_user;
    let event = await Event.findById(id);

    for(let userId of event.registeredUser)
    {
      if(user == userId)
      {
        console.log("user found and is registered");
        return res.status(200).send({
          registed: true
        })
      }
    }
    return res.status(200).send({
      registed: false
    })

  }
  catch(err)
  {
    console.log(err);
    res.status(400).send(err);
  }
}

const get_events = async(req,res)=>{
  try{
    let events = await Event.find({});
    // console.log(events);
    res.json(events);
  }
  catch(err)
  {
    console.log(err);
    res.send(err);
  }
};


const post_event = async(req,res)=>{
  try{
    let { name , description , venue , date , time , type , phone , image } = req.body;

    let hour = time.split(":");

    if(parseInt(hour[0]) > 12)
    {
      time = parseInt(hour[0])-12 + ":" + parseInt(hour[1]) + " pm";
    }else{
      time += " am";
    }

    console.log(time);

    let newEvent = new Event;

    newEvent.name        = name;
    newEvent.image       = image;
    newEvent.date        = hDate.prettyPrint(date);
    newEvent.time        = time;
    newEvent.venue       = venue;
    newEvent.eventType   = type;
    newEvent.contactNum  = phone;
    newEvent.description = description;


    await newEvent.save();

    res.status(201).json(newEvent);

  }
  catch(err)
  {
    console.log(err);
    res.status(401).send(err);
  }
};


const delete_event = async(req,res)=>{
  try{
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.status(200).send("event deleted successfuly");
  }
  catch(err)
  {
    console.log(err);
    res.status(400).send("something went wrong !");
  }
}

const get_event = async(req,res)=>{
  try{
    const { id } = req.params;
    let event = await Event.findById(id).populate({path: "registeredUser"});
    res.status(200).send(event);
  }
  catch(err)
  {
    console.log(err);
    res.status(400).send(err);
  }
}

const update_event = async(req,res)=>{
  try{
    let { id } = req.params;
    let event = await Event.findById(id);
    let { name , time ,date, description,type , venue , phone } = req.body;

    event.name = name;
    event.description = description;
    event.eventType = type;
    event.time = time;
    event.date = date;
    event.venue = venue;
    event.contactNum = phone;

    await event.save();

    res.status(200).send(event);

  }
  catch(err)
  {
    console.log("something went wrong !",err);
    res.status(400).send(err);
  }
}

const register_event_user = async(req,res)=>{
  try{
    let { id } = req.params;
    let event = await Event.findById(id);

    let curr_user = req.session.curr_user;
    let user = await User.findById(curr_user);

    event.registeredUser.push(user);
    await event.save();
    
    user.registeredEvent.push(event);
    await user.save();
    
    res.status(200).send(event);

  }
  catch(err)
  {
    console.log("something went wrong :",err);
    res.status(400).send(err);
  }
}

const get_registered_user = async(req,res)=>{
  try{
    const { id } = req.params;
    let events = await Event.findById(id).populate({path:"registeredUser"});
    console.log(events.registeredUser);
    res.status(200).send(events.registeredUser);
  }
  catch(err)
  {
    console.log(err);
    res.status(400).send(err);
  }
}

module.exports = {
  get_event,
  get_events,
  post_event,
  update_event,
  delete_event,
  user_is_registered,
  register_event_user,
  get_registered_user,
}
