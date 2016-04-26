'use strict';

const Request = require('request');

module.exports.fetchPeople = function () {

    return new Promise((resolve, reject) => {

        const endpoint = 'http://askbob.octo.com/api/v1/vqZe12GQsvPvQUNSjW5xceiKh/people.json';
        Request.get({ url: endpoint, json: true }, (err, response, body) => {

            if (err || response.statusCode !== 200) {
                return reject(err);
            }
            const people = body.items;
            resolve(people);
        });
    });
};
