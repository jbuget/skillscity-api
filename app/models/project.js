'use strict';

const db = require('../db').db();

module.exports.empty = function () {

    return new Promise((resolve, reject) => {

        db.cypher({ query: 'MATCH (p:Project) DELETE p' }, (err) => {

            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
};

module.exports.persist = function (project) {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: '' +
            'MERGE (id:UniqueId{name:"Project"}) ' +
            'ON CREATE SET id.count = 1 ' +
            'ON MATCH SET id.count = id.count + 1 ' +
            'WITH id.count AS uid ' +
            'CREATE (p:Project { id: uid, name: "' + project.name + '", client: "' + project.client + '" }) ' +
            'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
        }, (err, persistedProject) => {

            if (err) {
                return reject(err);
            }
            resolve(persistedProject);
        });
    });
};

module.exports.merge = function (project) {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: '' +
            'MATCH (p:Project { id: ' + project.id + ' }) ' +
            'SET p.name = "' + project.name + '", p.client = "' + project.client + '", p.image = "' + project.image + '" ' +
            'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
        }, (err, projects) => {

            if (err) {
                return reject(err);
            }
            resolve(projects[0]);
        });
    });
};

module.exports.get = function (projectId) {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: '' +
            'MATCH (p:Project {id: ' + projectId + '}) ' +
            'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image ' +
            'LIMIT 1'
        }, (err, projects) => {

            if (err) {
                return reject(err);
            }
            resolve(projects[0]);
        });
    });
};

module.exports.list = function () {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: 'MATCH (p:Project) RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
        }, (err, projects) => {

            if (err) {
                return reject(err);
            }
            resolve(projects);
        });
    });
};

module.exports.del = function (projectId) {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: 'MATCH (p:Project {id: ' + projectId + '}) DELETE p'
        }, (err) => {

            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
};

