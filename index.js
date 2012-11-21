"use strict";

var redis = require('redis'),
	nconf = require('nconf'),
	fs = require('fs');

nconf.argv()
	.env()
	.file({ file: __dirname + '/config.json' });

nconf.defaults({
    'remote_host': '',
    'remote_port': 6379,
    'local_host': '127.0.0.1',
    'local_port': 6379
});

var remote_host = nconf.get('remote_host'),
	remote_port = nconf.get('remote_port'),
	local_host = nconf.get('local_host'),
	local_port = nconf.get('local_port');

var remote_client = redis.createClient(remote_port, remote_host),
	local_client = redis.createClient(local_port, local_host);

remote_client.send_command("psubscribe", ['*'], function(data){
	remote_client.on('message', function(channel, message){
        local_client.publish(channel, message);
    });
});