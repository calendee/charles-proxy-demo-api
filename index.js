"use strict";
const Hapi = require("@hapi/hapi");

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
    path: '/users',
    handler: async (request) => {
      console.log(`DELETE /users at ${new Date().toTimeString()}`);
      const db = request.server.plugins.easydb.db;
      await(db.put('users', []))
      return {
        success: true
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/users',
    handler: async (request) => {
      console.log(`GET /users at ${new Date().toTimeString()}`);
      const db = request.server.plugins.easydb.db;
      const users = await(db.get('users'));
      return users;
    }
  });
  
  server.route({
    method: 'POST',
    path: '/users',
    handler: async (request) => {
      console.log(`POST /users at ${new Date().toTimeString()}`);
      const db = request.server.plugins.easydb.db;
      const payload = request.payload;
      const users = await(db.get('users'));
      if (payload && !payload.id) {
        const id = UUID();
        const usersCopy = [...users, {...payload, id}];
        await db.put('users', usersCopy)
        .catch((error) => {
          console.log('Failed to save user', error.message)
          return Boom.badImplementation();
        })
        return usersCopy
      }

      return null;
    }
  });

  server.route({
    method: 'PUT',
    path: '/users',
    handler: async (request) => {
      console.log(`PUT /users at ${new Date().toTimeString()}`);
      const db = request.server.plugins.easydb.db;
      const payload = request.payload;
      const users = await(db.get('users'));

      if (payload && payload.id) {
        const usersCopy = [...users];
        const userIndex = usersCopy.findIndex(user => user.id === payload.id);
        console.log('userIndex =', userIndex);
        usersCopy[userIndex] = { ...payload}

        if (!Number.isInteger(userIndex)) {
          return Boom.badImplementation();
        }

        await db.put('users', usersCopy)
        .catch((error) => {
          console.log('Failed to update user', error.message)
          return Boom.badImplementation();
        })
        return usersCopy
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