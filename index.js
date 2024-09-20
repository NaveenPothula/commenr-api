const mongoose = require("mongoose");

const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shuting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

require("dotenv").config();

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("succesful"));

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTIONS! Shuting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM! Shuting down...");
  server.close(() => {
    console.log("Process terminated");
  });
});
