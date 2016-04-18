'use strict';

const Boom = require('boom');
const Request = require('request');
const Person = require('../models/person');

const internals = {};

internals.retrievePeople = function (request, reply) {
    const endpoint = 'http://askbob.octo.com/api/v1/vqZe12GQsvPvQUNSjW5xceiKh/people.json';
    Request.get({ url: endpoint, json: true }, function (error, response, body) {
        const people = JSON.stringify(body.items).replace(/\"([^(\")"]+)\":/g, '$1:');
        if (!error && response.statusCode === 200) {
            internals.persistPeople(request, reply, people);
        } else {
            Boom.wrap(error);
        }
    });
};

internals.persistPeople = function (request, reply, people) {
    Person.createList(people, function (err, results) {
        if (err) {
            Boom.wrap(err);
        }
        return reply(results);
    });
};

internals.getPeople = function (request, reply) {
    Person.list(function (err, results) {
        if (err) {
            Boom.wrap(err);
        }
        var result = results[0];
        if (!result) {
            return reply('No user found.');
        }
        return reply(results);
    });
};

internals.synchronizePeople = function (request, reply) {
    Person.empty(function (err) {
        if (err) {
            Boom.wrap(err);
        }
        internals.retrievePeople(request, reply);
    });
};

module.exports.routes = [
    { path: '/people', method: 'GET', handler: internals.getPeople },
    { path: '/people', method: 'POST', handler: internals.synchronizePeople }
];
