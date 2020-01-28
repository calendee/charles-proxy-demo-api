"use strict";
const easyDB = require("easydb-io");

module.exports = {
   name: "easydb",
   version: "1.0.0",
   register: async server => {
     const db = easyDB({
      database: "35d24c4f-777f-488d-aae6-8e6a894a83bb",
      token: "6b9f600f-a616-4796-9150-3578c7ccf3bf",
    });
       
    // "expose" the db client so it is available everywhere "server" is available
    server.expose( "db", db );
   }
};