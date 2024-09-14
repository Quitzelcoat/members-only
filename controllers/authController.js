const bcrypt = require("bcrypt");
const pool = require("../db/pool");

exports.getIndex = (req, res) => {
  res.render("index");
};

exports.getSignup = (req, res) => {
  res.render("signup");
};

exports.getLogin = (req, res) => {
  res.render("login", { messages: req.flash() });
};

exports.getSecretKey = (req, res) => {
  res.render("secret");
};

exports.logout = async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.query(
      `UPDATE users SET membership_status = $1, is_member = $2 WHERE id = $3`,
      [false, false, userId]
    );

    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        req.flash("error_msg", "An error occurred while logging out.");
        return res.redirect("/dashboard");
      }

      req.flash("success_msg", "You have logged out");
      res.redirect("/login");
    });
  } catch (err) {
    console.error("Error resetting membership status:", err);
    req.flash(
      "error_msg",
      "An error occurred while resetting membership status."
    );
    return res.redirect("/dashboard");
  }
};

exports.signup = async (req, res) => {
  let { firstName, lastname, email, password, confPass } = req.body;
  let errors = [];

  if (!firstName || !lastname || !email || !password || !confPass) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password should at least be 6 characters" });
  }

  if (password !== confPass) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    return res.render("signup", { errors });
  }

  let hashedPassword = await bcrypt.hash(password, 10);

  pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
    (err, results) => {
      if (err) {
        throw err;
      }

      if (results.rows.length > 0) {
        errors.push({ message: "Email already registered" });
        return res.render("signup", { errors });
      }

      pool.query(
        `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, password`,
        [firstName, lastname, email, hashedPassword],
        (err, results) => {
          if (err) {
            throw err;
          }

          req.flash("success_msg", "You are now registered. Please log in.");
          res.redirect("/login");
        }
      );
    }
  );
};

exports.submitSecretKey = async (req, res) => {
  const { secretKey } = req.body;
  const userId = req.user.id;

  const correctSecretKey = "secret";

  if (secretKey === correctSecretKey) {
    try {
      await pool.query(
        `UPDATE users SET membership_status = $1, is_member = $2 WHERE id = $3`,
        [true, true, userId]
      );
      req.flash("success_msq", "You are now a member! Enjoy your privileges.");
      return res.redirect("/dashboard");
    } catch (err) {
      console.error("Error updating membership stauts:", err);
      req.flash(
        "error_msg",
        "An error occurred while updating membership status."
      );
      return res.redirect("/secret");
    }
  } else {
    req.flash("error_msg", "Incorrect secret key. Please try again.");
    return res.redirect("/secret");
  }
};

exports.ensureAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
};

// Middleware to check if user is authenticated
exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
};

// Middleware to ensure the user is a member
exports.ensureIsMember = (req, res, next) => {
  if (req.user && req.user.is_member) {
    return next();
  }
  req.flash("error_msg", "You must be a member to access this page.");
  res.redirect("/dashboard");
};
