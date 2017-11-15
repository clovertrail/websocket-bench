var signalR = require('@aspnet/signalr-client'),
  util       = require('util'),
  BaseWorker = require('./baseworker.js'),
  logger     = require('../logger.js');
  
XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
WebSocket = require('websocket').w3cwebsocket;
/**
 * SignalRCoreWorker Worker class inherits form BaseWorker
 */
var SignalRCoreWorker = function (server, generator) {
  SignalRCoreWorker.super_.apply(this, arguments);
};

util.inherits(SignalRCoreWorker, BaseWorker);
SignalRCoreWorker.prototype.createClient = function (callback) {
  var self = this;
  var client = new signalR.HubConnection(this.server);
  if (this.generator.beforeConnect) {
    this.generator.beforeConnect(client);
  }
  client.onclose(function() {
    if (this.verbose) {
       logger.debug("SignalR Core Connection is closed");
    }
  });
  client.start()
        .then(function() {
           callback(false, client);
        })
        .catch(error => {
           callback(true, client);
        });
};

module.exports = SignalRCoreWorker;
