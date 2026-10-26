const prisma = require("../prisma");

async function create(eventId, name, email) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  const registered = await prisma.registration.count({ where: { eventId } });

  if (registered >= event.capacity) return "full";

  try {
    await prisma.registration.create({ data: { eventId, name, email } });
    return "ok";
  } catch (err) {
    if (err.code === "P2002") return "duplicate";
    throw err;
  }
}

function findByEvent(eventId) {
  return prisma.registration.findMany({
    where: { eventId },
    select: { name: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}

module.exports = { create, findByEvent };
