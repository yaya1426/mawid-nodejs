require("dotenv/config");
const app = require("./app");
const prisma = require("./prisma");

const port = process.env.PORT || 3000;

async function start() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Connected to MySQL");
    app.listen(port, () => {
      console.log(`Mawid is running on port ${port}`);
    });
  } catch (err) {
    console.error(`Could not connect to MySQL: ${err.message}`);
    process.exit(1);
  }
}

start();
