const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const eventController = require("../controllers/event.controller");

const router = express.Router();

router.get("/dashboard", requireAuth, eventController.dashboard);
router.get("/events/new", requireAuth, eventController.showNew);
router.post("/events", requireAuth, eventController.create);
router.get("/events/:id/attendees", requireAuth, eventController.attendees);

router.get("/e/:slug", eventController.show);
router.post("/e/:slug/register", eventController.register);
router.get("/e/:slug/confirmed", eventController.confirmed);

module.exports = router;
