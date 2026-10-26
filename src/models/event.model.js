const prisma = require("../prisma");

const withCount = { _count: { select: { registrations: true } } };

function addRegistered(event) {
  return event && { ...event, registered: event._count.registrations };
}

async function create(organizerId, slug, title, location, startsAt, capacity) {
  const event = await prisma.event.create({
    data: { organizerId, slug, title, location, startsAt, capacity },
  });
  return event.id;
}

async function findByOrganizer(organizerId) {
  const events = await prisma.event.findMany({
    where: { organizerId },
    include: withCount,
    orderBy: { startsAt: "asc" },
  });
  return events.map(addRegistered);
}

async function findBySlug(slug) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: withCount,
  });
  return addRegistered(event);
}

function findByIdForOrganizer(id, organizerId) {
  return prisma.event.findFirst({
    where: { id, organizerId },
  });
}

module.exports = {
  create,
  findByOrganizer,
  findBySlug,
  findByIdForOrganizer,
};
