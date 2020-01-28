"use strict";

const db = require( "./db" );

module.exports.register = async server => {
   await server.register( db );
};