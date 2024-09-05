const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const pool = require("./db/pool");
const session = require("express-session");
const flash = require("connect-flash");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login", { messages: req.flash() });
});

app.get("/secret_key", (req, res) => {
  res.render("secret");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: "Work" });
});

app.post("/signup", async (req, res) => {
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

  // Form validation has passed
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
