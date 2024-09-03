const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/secret_key", (req, res) => {
  res.render("secret");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: "Work" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
