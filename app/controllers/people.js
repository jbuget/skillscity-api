'use strict';

const Boom = require('boom');
const Request = require('request');
const Person = require('../models/person');

const internals = {};

internals.cleanPeople = function () {

    return new Promise((resolve, reject) => {

        Person.empty((err) => {

            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
};

internals.retrievePeopleFromAskBob = function () {

    return new Promise((resolve, reject) => {

        const endpoint = 'http://askbob.octo.com/api/v1/vqZe12GQsvPvQUNSjW5xceiKh/people.json';
        Request.get({ url: endpoint, json: true }, (err, response, body) => {

            if (err || response.statusCode !== 200) {
                return reject(err);
            }
            const people = JSON.stringify(body.items).replace(/\"([^(\")"]+)\":/g, '$1:');
            resolve(people);
        });
    });
};

internals.convertIntoPeople = function (askBobItems) {
};

internals.persistPeople = function (people) {

    return new Promise((resolve, reject) => {

        Person.createList(people, (err, results) => {

            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

internals.retrievePeopleFromDb = function () {

    return new Promise((resolve, reject) => {

        Person.list((err, results) => {

            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports.getPeople = function (request, reply) {

    internals.retrievePeopleFromDb()
        .then((people) => reply(people))
        .catch((err) => reply(Boom.wrap(err)));
};

module.exports.synchronizePeople = function (request, reply) {

    internals.cleanPeople()
        .then(internals.retrievePeopleFromAskBob)
        .then(internals.persistPeople)
        .then((people) => reply(JSON.stringify(people)))
        .catch((err) => reply(Boom.wrap(err)));
};

