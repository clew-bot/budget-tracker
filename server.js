//NPM Packages
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const app = express();


//MiddleWare
app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Mongoose
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/budget";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Ports and Routes
const PORT = process.env.PORT || 8080;
app.use(require("./routes/api.js"));

// Listener
mongoose.connection
.once("open", () => console.log("Connected to + Mongoose")
  .on("error", (error) => {
    console.log("Your Error: ", error);
  }));
app.listen(PORT, () => {
  console.log("APP RUNNING ON PORT ") + PORT;
});
