"use strict";

const express = require("express");
const swaggerUI = require("swagger-ui-express");
const morgan = require("morgan");
const cors = require("cors");
const rfs = require("rotating-file-stream");
const path = require("path");
const bodyParser = require("body-parser");
const docs = require("./swagger-output.json");

const app = express();
// // create a rotating write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

// Middleware
app.use("/docs", swaggerUI.serve, swaggerUI.setup(docs));
// log to console
app.use(morgan("dev"));
// log all requests to access.log
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use(bodyParser.json());

// Import routes
const usersRoute = require("./routes/users");

// Route Middlewares
app.use("/users", usersRoute);

app.get("/", (req, res) => {
  let health_check = {
    uptime: process.uptime(),
    resposeTime: process.hrtime(),
    message: "welcome to stream-auth",
    timestamp: Date.now(),
  };
  try {
    res.status(200).send(health_check);
  } catch (err) {
    health_check.message = err;
    res.status(503).send(health_check);
  }
});

module.exports = app;
