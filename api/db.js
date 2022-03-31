"use strict";

const mongoose = require("mongoose");
const config = require("./config.js");

try {
  mongoose.connect(
    "mongodb://admin:ObiWan2022@database-shard-00-00.6suuw.mongodb.net:27017,database-shard-00-01.6suuw.mongodb.net:27017,database-shard-00-02.6suuw.mongodb.net:27017/travelmarket?ssl=true&replicaSet=atlas-7qr6aa-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useMongoClient: true },

    function (err, res) {
      if (err) throw err;
      console.log("Connected to MongoDB!");
    }
  );
} catch (err) {
  console.log("Cannot stablish a connection with MongoDB");
  console.log(err);
  process.exit(1);

  // return;
}

// "mongodb://admin:ObiWan2022@database-shard-00-00.6suuw.mongodb.net:27017,database-shard-00-01.6suuw.mongodb.net:27017,database-shard-00-02.6suuw.mongodb.net:27017/travelmarket?ssl=true&replicaSet=atlas-7qr6aa-shard-0&authSource=admin&retryWrites=true&w=majority",
// config.mongodb.server +
// "/travelmarket",
