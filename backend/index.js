const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect Database
const db = require("./models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Middleware
app.use(cors());
app.use(express.json());
process.setMaxListeners(0);

// Define Routes
app.use("/api/chat", require("./routers/chat.router"));
app.use("/api/prompt", require("./routers/prompt.router"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
