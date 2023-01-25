// Router config
const session = require("express-session");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const users = require("../controllers/user");

router.get("/register", users.renderRegister);
// actual logic
router.post("/register", users.register);

router.get("/login", users.renderLogin);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);

router.post("/logout", users.logout);


module.exports = router;
