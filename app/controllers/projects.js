'use strict';

const Boom = require('boom');
const Project = require('../models/project');

module.exports.listProjects = function (request, reply) {

    Project.list((err, results) => {

        if (err) {
            return reply(Boom.wrap(err));
        }
        reply(results);
    });
};

module.exports.getProject = function (request, reply) {

    const projectId = request.params.projectId;
    Project.get(projectId, (err, results) => {

        if (err) {
            return reply(Boom.wrap(err));
        }
        reply(results);
    });
};

module.exports.createProject = function (request, reply) {

    const project = request.payload;
    Project.persist(project, (err, results) => {

        if (err) {
            return reply(Boom.wrap(err));
        }
        reply(results);
    });
};

module.exports.updateProject = function (request, reply) {

    const project = request.payload;
    Project.merge(project, (err, results) => {

        if (err) {
            return reply(Boom.wrap(err));
        }
        reply(results);
    });
};

module.exports.deleteProject = function (request, reply) {

    const projectId = request.params.projectId;
    Project.del(projectId, (err) => {

        if (err) {
            return reply(Boom.wrap(err));
        }
        reply().code(204);
    });
};
