// controllers/messageController.js
const {
  createMessageQuery,
  getAllMessagesWithAuthors,
} = require("../db/quries");

// Render the form for creating a new message
exports.createMessageForm = (req, res) => {
  res.render("new-message", { user: req.user });
};

exports.submitMessage = async (req, res) => {
  const { title, content } = req.body; // This is already declared at the top, so remove duplication
  const userId = req.user.id; // You already have the userId, keep it

  try {
    // Call the query to insert the message into the database
    await createMessageQuery(title, content, userId); // Pass in title, content, and userId

    req.flash("success_msg", "Message created successfully!");
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error creating message:", err);
    req.flash("error_msg", "An error occurred while creating the message.");
    res.redirect("/messages/new");
  }
};

exports.getMsgDashboard = async (req, res) => {
  try {
    const messages = await getAllMessagesWithAuthors();

    const isMember = req.user && req.user.is_member;

    const processedMessages = messages.map((message) => {
      if (!isMember) {
        return {
          ...message,
          first_name: "Anonymous",
          timestamp: null,
        };
      }
      return message;
    });

    res.render("dashboard", {
      user: req.user,
      messages: Array.isArray(processedMessages) ? processedMessages : [],
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    req.flash("error_msg", "Error loading dashboard.");
    res.redirect("/login");
  }
};
