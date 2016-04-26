'use strict';

const Boom = require('boom');
const Person = require('../models/person');
const AskBobClient = require('../middlewares/askBobClient');

const internals = {};

module.exports.getPeople = function (request, reply) {

    Person.list()
        .then((people) => reply(people))
        .catch((err) => internals.replyWithWrappedError(reply, err));
};

module.exports.synchronizePeople = function (request, reply) {

    Person.empty()
        .then(AskBobClient.fetchPeople)
        .then(Person.createList)
        .then((people) => reply(JSON.stringify(people)))
        .catch((err) => internals.replyWithWrappedError(reply, err));
};

internals.replyWithWrappedError = function (reply, err) {

    console.error(err);
    return reply(Boom.wrap(err));
};
