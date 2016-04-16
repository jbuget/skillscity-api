'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Blipp = require('blipp');
const Config = require('config');
const Routes = require('./routes');

console.log('NODE_ENV: ' + Config.util.getEnv('NODE_ENV'));

const server = new Hapi.Server();

server.connection({port: 3000});

server.route(Routes);

server.register([{
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, {
    register: Blipp,
    options: {}
}], (err) => {
    if (err) {
        throw err; // something bad happened loading the plugin
    }
    server.start((err) => {
        if (err) {
            throw err;
        }
        server.log('info', 'Server running on ' + Config.get('env.name') + ' environment at: ' + server.info.uri);
    });
});

module.exports = server;