////////////////////////////Packages
require("dotenv").config({
  path: "./config.env",
});

process.on("uncaughtException", (err) => {
  console.log(`${err.name} : ${err.message}`);
  console.log("Shutting down App");
  process.exit(1);
});

///////////////////////////Files
const app = require("./app");
// const connectDB = require("./db");
// connectDB();

const server = app.listen(process.env.BACKEND_PORT || 5000, () => {
  console.log("Server started at port " + process.env.BACKEND_PORT);
});

server.setTimeout(120000); // 120 seconds timeout

process.on("unhandledRejection", (err, promise) => {
  console.log(`${err.name} : ${err.message}`);
  console.log(`Atpromise: ${promise}`);
  console.log("Shutting down App");
  server.close(() => {
    process.exit(1);
  });
});
