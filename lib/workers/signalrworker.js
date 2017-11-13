var signalR = require('signalr-client'),
  util       = require('util'),
  BaseWorker = require('./baseworker.js'),
  logger     = require('../logger.js');
/**
 * SignalRWorker Worker class inherits form BaseWorker
 */
var SignalRWorker = function (server, generator) {
  SignalRWorker.super_.apply(this, arguments);
};

util.inherits(SignalRWorker, BaseWorker);
SignalRWorker.prototype.createClient = function (callback) {
  var self = this;
  var client = new signalR.client(
                   this.server,
                   [process.env.SIGNALRHUB],
                   process.env.TIMEOUT);
  if (this.generator.beforeConnect) {
    this.generator.beforeConnect(client);
  }
  client.serviceHandlers.connected = function(connection) {
     callback(false, client);
  };
  client.serviceHandlers.connectFailed = function(err) {
     if (self.verbose) {
        logger.error("SignalR Worker connect_failed " + JSON.stringify(err));
     }
     callback(true, client);
  };
  client.serviceHandlers.connectionLost = function(err) {
     if (self.verbose) {
        logger.error("SignalR Worker connect_lost " + JSON.stringify(err));
     }
     callback(true, client);
  };
  client.serviceHandlers.bindingError = function(err) {
     if (self.verbose) {
        logger.error("SignalR Worker error occurs " + JSON.stringify(err));
     }
     callback(true, client);
  };
  client.serviceHandlers.onerror = function(err) {
     if (self.verbose) {
        logger.error("SignalR Worker error " + JSON.stringify(err));
     }
     callback(true, client);
  };
  client.serviceHandlers.disconnected = function(err) {
     if (self.verbose) {
        logger.error("disconnected");
     }
     callback(true, client);
  };
};

module.exports = SignalRWorker;
