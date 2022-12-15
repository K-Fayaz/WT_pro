const express = require("express");
const router = express.Router();
const controller = require("../Controller/auth.controller");

router.post("/confirm/email/", controller.confirm_email);

router.get("/get/cookie/email/confirm", controller.get_confirmation_cookie);

router.post("/user/register/", controller.register_user);

router.post("/login", controller.post_login);

router.get("/auth/get/user", controller.isLoggedIn);

router.post("/logout", controller.logout);

router.get("/auth/admin/verify", controller.verifyAuthority);

// router.get("/user/log/",controller.isLoggedIn)

module.exports = router;
