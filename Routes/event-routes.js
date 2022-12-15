const express = require("express");
const controller = require("../Controller/event.controller");

const router = express.Router();

router.get("/get/events", controller.get_events);

router.post("/post/events", controller.post_event);

router.post("/event/register/:id",controller.register_event_user);

router.delete("/delete/event/:id",controller.delete_event);

router.get("/event/:id",controller.get_event);


router.put("/event/:id/edit",controller.update_event);

router.get("/user/is/registerd/:id",controller.user_is_registered);

router.get("/event/users/:id",controller.get_registered_user);


module.exports = router;
