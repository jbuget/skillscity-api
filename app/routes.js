'use strict';

const Boom = require('boom');
const Request = require('request');
const Neo4j = require('neo4j');
const Config = require('config');

const db = new Neo4j.GraphDatabase(
    Config.get('db.scheme') + "://" +
    Config.get('db.username') + ":" +
    Config.get('db.password') + "@" +
    Config.get('db.host') + ":" +
    Config.get('db.port')
);

/*
Request.debug = true;
require('request-debug')(Request);
*/

let internals = {};

internals.sayHelloWorld = function (request, reply) {
    reply('Hello, world!');
};

internals.sayHello = function (request, reply) {
    reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
};

internals.getPeople = function (request, reply) {
    db.cypher({
        query: 'MATCH (p:Person) RETURN p'
    }, function (err, results) {
        if (err) throw err;
        var result = results[0];
        if (!result) {
            console.log('No user found.');
        } else {
            reply(results);
        }
    });
};

internals.synchronizePeople = function (request, reply) {
    const endpoint = 'http://askbob.octo.com/api/v1/vqZe12GQsvPvQUNSjW5xceiKh/people.json';
    Request.get({url: endpoint, json:true}, function (error, response, body) {
        var people = JSON.stringify(body.items).replace(/\"([^(\")"]+)\":/g,"$1:");
        if (!error && response.statusCode == 200) {
            db.cypher({
                query: 'UNWIND ' + people + ' AS people CREATE (p:Person) SET p = people'
            }, function (err, results) {
                if (err) throw err;
                reply('Yeah!');
            });
        } else {
            Boom.internal(error);
        }
    });
};

module.exports = [
    {method: 'GET', path: '/', handler: internals.sayHelloWorld},
    {method: 'GET', path: '/{name}', handler: internals.sayHello},
    {method: 'GET', path: '/people', handler: internals.getPeople},
    {method: 'POST', path: '/people', handler: internals.synchronizePeople}
];