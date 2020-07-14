//
//  fluentproxy.js  --  A Syslog-to-fluentd proxy.
//    This implements a "push" model, rather than the existing "pull" model available with fluentd.
//
//  John D. Allen
//  A10 Networks
//  jallen@a10networks.com
//  July, 2020
//
//  Copyright (C) 2020 by A10 Networks, All Rights Reserved
//  Usage granted as provided in the MIT License.
//
//  Uses:
//     https://github.com/guithess/syslog-server
//     https://www.npmjs.com/package/fluent-logger
//

var logger = require('fluent-logger');
var SyslogServer = require('syslog-server');
var server = new SyslogServer();
var config = require('./config.json');

var DEBUG = config.debug;

var fluentip = config.fluent_ip || '0.0.0.0';
var fluentport = config.fluent_port || 24224;
var fltimeout = config.timeout || 3.0;
var flreconnect = config.reconnect || 60000;
var port = config.port || 514;
var label = config.label || "a10";

if (DEBUG > 7) { console.log(">>>>" + fluentip); }

logger.configure('debug', {
  host: fluentip,
  port: fluentport,
  timeout: fltimeout,
  reconnectInterval: flreconnect
});

if (DEBUG > 3 || config.showstart) {
  logger.emit(label, {message: "a10-fluent proxy started..."});
  if (DEBUG > 7) { console.log("a10-fluent proxy starting..."); }
}

server.on("message", (msg) => {
  if (DEBUG > 7) { console.log(">>" + JSON.stringify(msg)); }
  logger.emit(label, msg);
});

server.start({port: port});
