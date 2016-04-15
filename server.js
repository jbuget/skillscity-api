'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Blipp = require('blipp');
const Routes = require('./routes');

const Neo4j = require('neo4j');
var db = new Neo4j.GraphDatabase('http://username:password@localhost:7474');

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
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});


module.exports = server;