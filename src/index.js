"use strict";

const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

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
