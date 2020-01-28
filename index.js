"use strict";
const Hapi = require("@hapi/hapi");
require('dotenv').config()

const plugins = require( "./src/plugins" );
const UUID = require('uuid');
const Boom = require('@hapi/boom');

const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: "localhost",
  });

  // register plugins
  await plugins.register(server);

  server.route({
    method: 'DELETE',
    path: '/dogs',
    handler: async (request) => {
      console.log(`DELETE /dogs at ${new Date().toTimeString()}`);
      const db = request.server.plugins.easydb.db;
      await(db.put('dogs', []))
      return {
        success: true
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/dogs',
    handler: async (request) => {
      console.log(`GET /dogs at ${new Date().toTimeString()}`);
      const db = request.server.plugins.easydb.db;
      const dogs = await(db.get('dogs'))
      .catch(error => {
        if (error.message.includes('404')) {
          // There simply are no records in the DB
          return [];
        }
        console.log('Failed to get dogs', error.message);

        return Boom.badImplementation();
      })
      return dogs;
    }
  });
  
  server.route({
    method: 'POST',
    path: '/dogs',
    handler: async (request) => {
      console.log(`POST /dogs at ${new Date().toTimeString()}`);
      const db = request.server.plugins.easydb.db;
      const payload = request.payload;
      const dogs = await(db.get('dogs'))
      .catch(error => {
        if (error.message.includes('404')) {
          // There simply are no records in the DB
          return [];
        }
        console.log('Failed to get dogs', error.message);

        return Boom.badImplementation();
      })

      if (payload && !payload.id) {
        const id = UUID();
        const dogsCopy = [...dogs, {...payload, id}];
        await db.put('dogs', dogsCopy)
        .catch((error) => {
          console.log('Failed to save dog', error.message)
          return Boom.badImplementation();
        })
        return dogsCopy
      }

      return null;
    }
  });

  server.route({
    method: 'PUT',
    path: '/dogs',
    handler: async (request) => {
      console.log(`PUT /dogs at ${new Date().toTimeString()}`);
      const db = request.server.plugins.easydb.db;
      const payload = request.payload;
      const dogs = await(db.get('dogs'));

      if (payload && payload.id) {
        const dogsCopy = [...dogs];
        const dogIndex = dogsCopy.findIndex(dog => dog.id === payload.id);
        console.log('dogIndex =', dogIndex);
        dogsCopy[dogIndex] = { ...payload}

        if (!Number.isInteger(dogIndex)) {
          return Boom.badImplementation();
        }

        await db.put('dogs', dogsCopy)
        .catch((error) => {
          console.log('Failed to update dog', error.message)
          return Boom.badImplementation();
        })
        return dogsCopy
      }
      
      return null;
    }
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();