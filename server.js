const app = require("./app");
const { serverPort } = require("./config");
const db = require("./db");

app.listen(serverPort, async () => {
  try {
    await db.connect();
    console.log("Database connection successful.");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log(`Server running. Use our API on port: ${serverPort}`);
});

process.on("SIGINT", async () => {
  await db.disconnect();
  console.log("Database connection closed.");
  process.exit();
});
