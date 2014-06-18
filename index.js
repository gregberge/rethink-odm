/**
 * Module dependencies.
 */

var Client = require('./lib/client');

/**
 * Expose module.
 */

module.exports = function createConnection(options) {
  return new Client(options);
};