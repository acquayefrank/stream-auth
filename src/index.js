"use strict";

const express = require("express");
const swaggerUI = require("swagger-ui-express");
const morgan = require("morgan");
const cors = require("cors");
const rfs = require("rotating-file-stream");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const docs = require("./docs");

// Load env variables
dotenv.config();

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

// Connect to DB
let dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let dbConnection = process.env.MONGO_URL;

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

mongoose.connect(dbConnection, dbOptions).catch((err) => {
  if (err.message.indexOf("ECONNREFUSED") !== -1) {
    console.error(
      "Error: The server was not able to reach MongoDB. Maybe it's not running?"
    );
    console.error(err);
  } else {
    throw err;
  }
});
console.log(
  `\nConnection state is: ${mongoose.connection.readyState}\nConnection key:\n0 = disconnected, \n1 = connected, \n2 = connecting, \n3 = disconnecting\n`
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database\n\n"));

// PORT
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`stream-auth listening on port ${port}!`);
});
