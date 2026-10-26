const path = require("path");
const express = require("express");
const helmet = require("helmet");
const sessionMiddleware = require("./session");
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(sessionMiddleware);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use(authRoutes);
app.use(eventRoutes);

module.exports = app;
