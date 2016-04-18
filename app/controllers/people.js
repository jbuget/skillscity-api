'use strict';

const Boom = require('boom');
const Request = require('request');
const Person = require('../models/person');

module.exports.retrievePeople = function (request, reply) {
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

module.exports.persistPeople = function (request, reply, people) {
    Person.createList(people, function (err, results) {
        if (err) {
            Boom.wrap(err);
        }
        return reply(results);
    });
};

module.exports.getPeople = function (request, reply) {
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

module.exports.synchronizePeople = function (request, reply) {
    Person.empty(function (err) {
        if (err) {
            Boom.wrap(err);
        }
        internals.retrievePeople(request, reply);
    });
};
