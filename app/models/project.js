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
        'RETURN p'
    }, callback);
};

module.exports.merge = function (project, callback) {

};

module.exports.get = function (projectId, callback) {
    db.cypher({
        query: 'MATCH (p:Project {id: ' + projectId + '}) RETURN p'
    }, callback);
};

module.exports.list = function (callback) {
    db.cypher({
        query: 'MATCH (p:Project) RETURN p'
    }, callback);
};

module.exports.remove = function (projectId, callback) {
    db.cypher({
        query: 'MATCH (p:Project {id: ' + projectId + '}) DELETE p'
    }, callback);
};

