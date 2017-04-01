/* eslint-disable no-console */
'use strict';

require('dotenv').config();

const logger = require('winston');
const app = require('./app');
const port = app.get('serverPort');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(`Feathers application started on ${app.get('host')}:${port}`)
);
