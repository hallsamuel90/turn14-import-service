#!/usr/bin/env node

/**
 * Module dependencies.
 */
import Debug from 'debug';
import http from 'http';
import app from '../app';

const debug = Debug('turn14-import-service:server');

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {string} val
 *
 * @return {string|number|boolean} normalized port
 */
function normalizePort(val: string): string | number | boolean {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '8081');
app.set('port', port);

/**
 * Event listener for HTTP server "error" event.
 *
 * @param {NodeJS.ErrnoException} error
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
