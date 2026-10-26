const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./prisma");

const store = new PrismaSessionStore(prisma, {
  checkPeriod: 10 * 60 * 1000,
  dbRecordIdIsSessionId: true,
});

module.exports = session({
  secret: process.env.SESSION_SECRET,
  store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});
