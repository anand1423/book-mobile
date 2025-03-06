require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

const connectDB = require("./src/config/mongoose");

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Load routes
app.use("/api", require("./src/routes"));

// Start server
app.listen(PORT, (error) => {
  if (error) {
    console.log("Error in running the server", error);
  }
  console.log(`Server running on port ${PORT}`);
});
