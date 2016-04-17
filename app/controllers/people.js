'use strict';

const Boom = require('boom');
const Request = require('request');
const Person = require('../models/person');

let internals = {};

internals.retrievePeople = function (request, reply) {
    const endpoint = 'http://askbob.octo.com/api/v1/vqZe12GQsvPvQUNSjW5xceiKh/people.json';
    Request.get({url: endpoint, json: true}, function (error, response, body) {
        var people = JSON.stringify(body.items).replace(/\"([^(\")"]+)\":/g, "$1:");
        if (!error && response.statusCode == 200) {
            internals.persistPeople(request, reply, people);
        } else {
            Boom.internal(error);
        }
    });
};

internals.persistPeople = function (request, reply, people) {
    Person.createList(people, function (err) {
        if (err) throw err;
        reply('Yeah!');
    });
};

module.exports.getPeople = function (request, reply) {
    Person.list(function (err, results) {
        if (err) throw err;
        var result = results[0];
        if (!result) {
            reply('No user found.');
        } else {
            reply(results);
        }
    });
};

module.exports.synchronizePeople = function (request, reply) {
    Person.empty(function (err) {
        if (err) throw err;
        internals.retrievePeople(request, reply);
    });
};