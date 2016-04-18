'use strict';

const Boom = require('boom');
const Request = require('request');
const Person = require('../models/person');

const internals = {};

internals.cleanPeople = function () {
    return new Promise(function (resolve, reject) {
        Person.empty(function (err) {
            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
};

internals.retrievePeopleFromAskBob = function () {
    return new Promise(function (resolve, reject) {
        const endpoint = 'http://askbob.octo.com/api/v1/vqZe12GQsvPvQUNSjW5xceiKh/people.json';
        Request.get({url: endpoint, json: true}, function (err, response, body) {
            const people = JSON.stringify(body.items).replace(/\"([^(\")"]+)\":/g, '$1:');
            if (err || response.statusCode !== 200) {
                return reject(err);
            }
            resolve(people);
        });
    });
};

internals.persistPeople = function (people) {
    return new Promise(function (resolve, reject) {
        Person.createList(people, function (err, results) {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

internals.retrievePeopleFromDb = function () {
    return new Promise(function (resolve, reject) {
        Person.list(function (err, results) {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports.getPeople = function (request, reply) {
    internals.retrievePeopleFromDb()
        .then(people => reply(people))
        .catch(err => reply(Boom.wrap(err)));
};

module.exports.synchronizePeople = function (request, reply) {
    internals.cleanPeople()
        .then(internals.retrievePeopleFromAskBob)
        .then(internals.persistPeople)
        .then(people => reply(people))
        .catch(err => reply(Boom.wrap(err)));
};

