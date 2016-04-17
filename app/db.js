'use strict';

const Neo4j = require('neo4j');
const Config = require('config');

let db;

module.exports.db = function() {
    if (!db) {
        db = new Neo4j.GraphDatabase(
            Config.get('db.scheme') + "://" +
            Config.get('db.username') + ":" +
            Config.get('db.password') + "@" +
            Config.get('db.host') + ":" +
            Config.get('db.port')
        );
    }
    return db;
};