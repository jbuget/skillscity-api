'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Config = require('config');
const Routes = require('./routes');

const server = new Hapi.Server();

const serverPort = process.env.PORT || 3000;

server.connection({ port: serverPort });

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
}, require('blipp')], (err) => {

    if (err) {
        throw err;
    }
    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running on ' + Config.get('env.name') + ' environment at: ' + server.info.uri);
    });
});

module.exports = server;
