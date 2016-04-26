'use strict';

const db = require('../db').db();

module.exports.persist = function (project, callback) {

    db.cypher({
        query: '' +
        'MERGE (id:UniqueId{name:"Project"}) ' +
        'ON CREATE SET id.count = 1 ' +
        'ON MATCH SET id.count = id.count + 1 ' +
        'WITH id.count AS uid ' +
        'CREATE (p:Project { id: uid, name: "' + project.name + '", client: "' + project.client + '" }) ' +
        'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
    }, callback);
};

module.exports.merge = function (project, callback) {

    db.cypher({
        query: '' +
        'MATCH (p:Project { id: ' + project.id + ' }) ' +
        'SET p.name = "' + project.name + '", p.client = "' + project.client + '", p.image = "' + project.image + '" ' +
        'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
    }, callback);
};

module.exports.get = function (projectId, callback) {

    db.cypher({
        query: '' +
        'MATCH (p:Project {id: ' + projectId + '}) ' +
        'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image ' +
        'LIMIT 1'
    }, (err, results) => {

        callback(err, results[0]);
    });
};

module.exports.list = function (callback) {

    db.cypher({
        query: 'MATCH (p:Project) RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
    }, callback);
};

module.exports.del = function (projectId, callback) {

    db.cypher({
        query: 'MATCH (p:Project {id: ' + projectId + '}) DELETE p'
    }, callback);
};

