const prisma = require("../prisma");

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function create(name, email, passwordHash) {
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });
  return user.id;
}

module.exports = { findByEmail, create };
