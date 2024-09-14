const express = require("express");
const passport = require("passport");
const {
  getIndex,
  getSignup,
  getLogin,
  getSecretKey,
  logout,
  signup,
  submitSecretKey,
  checkAuthenticated,
  ensureAuthenticated,
} = require("../controllers/authController");

const { getMsgDashboard } = require("../controllers/messageController");

const router = express.Router();

router.get("/", getIndex);
router.get("/signup", checkAuthenticated, getSignup); // Redirect to dashboard if logged in
router.get("/login", checkAuthenticated, getLogin); // Redirect to dashboard if logged in
router.get("/secret", ensureAuthenticated, getSecretKey);
router.get("/dashboard", getMsgDashboard);
router.get("/logout", logout);

router.post("/signup", signup);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.post("/secret", ensureAuthenticated, submitSecretKey);

module.exports = router;
