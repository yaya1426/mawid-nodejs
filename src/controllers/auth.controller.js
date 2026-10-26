const bcrypt = require("bcrypt");
const User = require("../models/user.model");

function showSignup(req, res) {
  res.render("signup", { error: null });
}

async function signup(req, res) {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!name || !email || !password) {
    return res.status(400).render("signup", { error: "All fields are required." });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .render("signup", { error: "Password must be at least 8 characters." });
  }

  const existing = await User.findByEmail(email);
  if (existing) {
    return res
      .status(400)
      .render("signup", { error: "That email is already taken." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = await User.create(name, email, passwordHash);

  req.session.user = { id, name };
  res.redirect("/");
}

function showLogin(req, res) {
  res.render("login", { error: null });
}

async function login(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  const user = await User.findByEmail(email);
  if (!user) {
    return res
      .status(401)
      .render("login", { error: "Wrong email or password." });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res
      .status(401)
      .render("login", { error: "Wrong email or password." });
  }

  req.session.user = { id: user.id, name: user.name };
  res.redirect("/");
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = {
  showSignup,
  signup,
  showLogin,
  login,
  logout,
};
