'use strict';

const Request = require('request');
const Config = require('config');

module.exports.fetchPeople = function () {

    return new Promise((resolve, reject) => {

        Request.get({ url: Config.get('askbob.endpoint'), json: true }, (err, response, body) => {

            if (err || response.statusCode !== 200) {
                return reject(err);
            }
            const people = body.items;
            resolve(people);
        });
    });
};
