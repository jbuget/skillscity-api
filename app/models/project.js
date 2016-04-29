'use strict';

const db = require('../middlewares/db').db();
const Uuid = require('uuid');

module.exports.empty = function () {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: 'MATCH (p:Project) DELETE p'
        }, (err) => {

            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
};

module.exports.persist = function (project) {

    return new Promise((resolve, reject) => {

        project.uuid = Uuid.v4();
        db.cypher({
            query: 'CREATE (p:Project { props } ) RETURN p',
            params: {
                props: project
            },
            lean: true
        }, (err, results) => {

            if (err) {
                return reject(err);
            }
            const project = results[0]['p'];
            resolve(project);
        });
    });
};

module.exports.merge = function (project) {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: 'MATCH (p:Project { uuid: { uuid } }) SET p += { props } RETURN p',
            params: {
                uuid: project.uuid,
                props: project
            },
            lean: true
        }, (err, results) => {

            if (err) {
                return reject(err);
            }
            const project = results[0]['p'];
            resolve(project);
        });
    });
};

module.exports.get = function (projectId) {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: 'MATCH (p:Project { uuid: { uuid } }) RETURN p',
            params: { uuid: projectId },
            lean: true
        }, (err, results) => {

            if (err) {
                return reject(err);
            }
            const project = results[0]['p'];
            resolve(project);
        });
    });
};

module.exports.list = function () {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: 'MATCH (p:Project) RETURN p',
            lean: true
        }, (err, results) => {

            if (err) {
                return reject(err);
            }
            const projects = results.map((result) => {
                return result['p'];
            });
            resolve(projects);
        });
    });
};

module.exports.del = function (projectId) {

    return new Promise((resolve, reject) => {

        db.cypher({
            query: 'MATCH (p:Project { uuid: { uuid } }) DELETE p',
            params: { uuid: projectId },
            lean: true
        }, (err) => {

            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
};

