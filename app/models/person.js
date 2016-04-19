'use strict';

const db = require('../db').db();

module.exports.empty = function (callback) {

    db.cypher({
        query: 'MATCH (p:Person) DELETE p'
    }, callback);
};

module.exports.createList = function (people, callback) {

    db.cypher({
        query: 'UNWIND ' + people + ' AS people CREATE (p:Person) SET p = people RETURN p'
    }, callback);
};

module.exports.create = function (project, callback) {
};

module.exports.update = function (project, callback) {

};

module.exports.get = function (projectId, callback) {

};

module.exports.list = function (callback) {

    db.cypher({
        query: 'MATCH (p:Person) RETURN p'
    }, callback);
};

module.exports.remove = function (projectId, callback) {

};

module.exports.search = function (pattern) {

};

