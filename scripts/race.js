// Sends 20 registrations at the same moment: node scripts/race.js <event-slug>
const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/race.js <event-slug>");
  process.exit(1);
}

const url = `http://localhost:3000/e/${slug}/register`;

async function main() {
  const requests = [];
  for (let i = 1; i <= 20; i++) {
    requests.push(
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name: `Person ${i}`,
          email: `person${i}@test.com`,
        }),
        redirect: "manual",
      })
    );
  }

  const responses = await Promise.all(requests);
  const registered = responses.filter((r) => r.status === 302).length;
  console.log(
    `20 requests sent, ${registered} registered, ${20 - registered} rejected`
  );
}

main();
