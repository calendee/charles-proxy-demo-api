"use strict";
const easyDB = require("easydb-io");
require('dotenv').config();
console.log('EASY_DB_UUID', process.env.EASY_DB_UUID)
console.log('EASY_DB_TOKEN', process.env.EASY_DB_TOKEN)

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