'use strict';

const db = require('../middlewares/db').db();

module.exports.empty = function () {

    return new Promise((resolve, reject) => {

        db.cypher({ query: 'MATCH (p:Person) DELETE p' }, (err) => {

            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
};

module.exports.createList = function (people) {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: '' +
            'UNWIND ' + people + ' AS people ' +
            'CREATE (p:Person) SET p = people ' +
            'RETURN p.nickname AS nickname, p.first_name AS firstName, p.last_name AS lastName'
        }, (err, persistedPeople) => {

            if (err) {
                return reject(err);
            }
            resolve(persistedPeople);
        });
    });

};

module.exports.create = function (project, callback) {
};

module.exports.update = function (project, callback) {

};

module.exports.get = function (projectId, callback) {

};

module.exports.list = function () {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: 'MATCH (p:Person) RETURN p.nickname AS nickname, p.first_name AS firstName, p.last_name AS lastName'
        }, (err, persistedPeople) => {

            if (err) {
                return reject(err);
            }
            resolve(persistedPeople);
        });
    });
};

module.exports.remove = function (projectId, callback) {

};

module.exports.search = function (pattern) {

};

