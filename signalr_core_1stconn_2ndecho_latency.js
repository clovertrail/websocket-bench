/*global module, require*/
var fs = require('fs');
var logger = require('./lib/logger');

module.exports = {

  /**
   * Before connection (just for faye)
   * @param {client} client connection
   */
  beforeConnect : function (client) {
    // Your logic
    // By example
    // client.setHeader('Authorization', 'OAuth abcd-1234');
    // client.disable('websocket');
  },

  /**
   * on socket io connect
   * @param {client} client connection
   * @param {done}   callback function(err) {}
   */
  onConnect : function (client, done) {
    var sendMsg = function (client, messagePrefix, recordError) {
	    client.invoke('echo', messagePrefix, Date.now());
    }
    // Your logic
    // client.subscribe('/test', function() {});
    var ttl = [];
    var error = undefined;
    var received = undefined;
    var start = undefined;
    var counter = 0;
    var handleError = function (err) {
	    error = err;
    };
    client.on('broadcastMessage',
	function(name, message) {
		logger.debug("broadcast from server: " + name + " " + message);
	});
    client.on('start',
	function(message) {
		start = true;
		logger.debug("Server informs to start sending message");
	});
    client.on('echo',
        function(name, message) {
	    var end = Date.now();
	    ttl.push({start: message, end: end});
	    if (counter > 10) {
	       for (var i = 0; i < ttl.length; i++) {
	  	 fs.appendFile("signalr_core_1stconn_2ndecho_perf.txt",
	  		"user: " + name + " " + ttl[i].start + "|" + ttl[i].end + "\n");
	       }
               done(error);
	    }
            counter++;
	    error = undefined;
	    received = true;
        });
    var repeatEcho = function(client) {
	if (start) {
	    sendMsg(client, 'repeated ', handleError);
	}
	setTimeout(repeatEcho, 1000, client);
    }
    setTimeout(repeatEcho, 1000, client);
  },

  /**
   * send a message
   * @param {client} client connection
   * @param {done}   callback function(err) {}
   */
  sendMessage : function (client, done) {
    //logger.error('Not implement method sendMessage in generator');
    // Your logic
    //client.emit('echo', { hello: 'world' });
    //client.publish('/test', { hello: 'world' });
    done();
  }
};
