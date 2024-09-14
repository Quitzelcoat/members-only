const express = require("express");
const router = express.Router();
const {
  createMessageForm,
  submitMessage,
} = require("../controllers/messageController");

const {
  ensureAuthenticated,
  ensureIsMember,
} = require("../controllers/authController");

// Show the "Create New Message" form (only for logged-in members)
router.get("/new", ensureAuthenticated, ensureIsMember, createMessageForm);

// Handle the submission of the new message
router.post("/new", ensureAuthenticated, ensureIsMember, submitMessage);

module.exports = router;
