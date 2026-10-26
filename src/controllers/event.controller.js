const crypto = require("crypto");
const Event = require("../models/event.model");
const Registration = require("../models/registration.model");

function makeSlug(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "event"}-${crypto.randomBytes(3).toString("hex")}`;
}

async function dashboard(req, res) {
  const events = await Event.findByOrganizer(req.session.user.id);
  res.render("dashboard", { events });
}

function showNew(req, res) {
  res.render("new-event", { error: null });
}

async function create(req, res) {
  const title = (req.body.title || "").trim();
  const location = (req.body.location || "").trim();
  const startsAt = req.body.startsAt;
  const capacity = Number(req.body.capacity);

  if (!title || !startsAt || !(capacity >= 1)) {
    return res
      .status(400)
      .render("new-event", { error: "Title, date and capacity are required." });
  }

  await Event.create(
    req.session.user.id,
    makeSlug(title),
    title,
    location || null,
    new Date(startsAt),
    capacity
  );
  res.redirect("/dashboard");
}

async function show(req, res) {
  const event = await Event.findBySlug(req.params.slug);
  if (!event) return res.status(404).send("Event not found");
  res.render("event", { event, error: null });
}

const messages = {
  full: "Sorry, this event is full.",
  duplicate: "This email is already registered for this event.",
};

async function register(req, res) {
  const event = await Event.findBySlug(req.params.slug);
  if (!event) return res.status(404).send("Event not found");

  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  if (!name || !email) {
    return res
      .status(400)
      .render("event", { event, error: "Name and email are required." });
  }

  const result = await Registration.create(event.id, name, email);
  if (result !== "ok") {
    return res.status(409).render("event", { event, error: messages[result] });
  }
  res.redirect(`/e/${event.slug}/confirmed`);
}

async function confirmed(req, res) {
  const event = await Event.findBySlug(req.params.slug);
  if (!event) return res.status(404).send("Event not found");
  res.render("confirmed", { event });
}

async function attendees(req, res) {
  const id = Number(req.params.id);
  const event = Number.isInteger(id)
    ? await Event.findByIdForOrganizer(id, req.session.user.id)
    : null;
  if (!event) return res.status(404).send("Event not found");
  const list = await Registration.findByEvent(event.id);
  res.render("attendees", { event, attendees: list });
}

module.exports = {
  dashboard,
  showNew,
  create,
  show,
  register,
  confirmed,
  attendees,
};
