'use strict';

require('dotenv').config();
const webServer = require('./webserver');
const httpServerConfig = require('./config/http-server-config');
const mysqlPool = require('./databases/mysql-pool');
const mongoPool = require('./databases/mongo-pool');

// Para gestionar los errores en funciones síncronas o async/await
process.on('uncaughtException', (err) => {
  console.error('excepción inesperada', err.message, err);
});

// Estos dos "process.on" hay que ponerlos en todos los proyectos para gestionar los errores.

// Para gestionar errores en las promises o callbacks
process.on('unhandledRejection', (err) => {
  console.error('Error inesperado', err.message, err);
});

/**
 * Initialize dependencies
 * */
(async function initApp() {
  try {
    await mysqlPool.connect();
    await mongoPool.connect();
    await webServer.listen(httpServerConfig.port);
    console.log(`server running at: ${httpServerConfig.port}`);
  } catch (e) {
    await webServer.close();
    console.error(e);
    process.exit(1);
  }
}()); // Los parentesis son para que la función se autollame
