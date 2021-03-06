"use strict";
const easyDB = require("easydb-io");
require('dotenv').config();

module.exports = {
   name: "easydb",
   version: "1.0.0",
   register: async server => {
     const db = easyDB({
      database: process.env.EASY_DB_UUID,
      token: process.env.EASY_DB_TOKEN,
    });
       
    // "expose" the db client so it is available everywhere "server" is available
    server.expose( "db", db );
   }
};