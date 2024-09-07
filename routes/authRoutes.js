const express = require("express");
const passport = require("passport");
const {
  getIndex,
  getSignup,
  getLogin,
  getSecretKey,
  getDashboard,
  logout,
  signup,
  submitSecretKey,
} = require("../controllers/authController");

const router = express.Router();

// Middleware to check if user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
}

function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

router.get("/", getIndex);
router.get("/signup", checkAuthenticated, getSignup); // Redirect to dashboard if logged in
router.get("/login", checkAuthenticated, getLogin); // Redirect to dashboard if logged in
router.get("/secret", ensureAuthenticated, getSecretKey);
router.get("/dashboard", getDashboard);
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
