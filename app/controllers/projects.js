'use strict';

const Boom = require('boom');
const Project = require('../models/project');

module.exports.listProjects = function (request, reply) {
    Project.list(function (err, results) {
        if (err) {
            return reply(Boom.wrap(err));
        }
        return reply(results);
    });
};

module.exports.getProject = function (request, reply) {
    var projectId = request.params.projectId;
    Project.get(projectId, function (err, results) {
        if (err) Boom.wrap(err);
        return reply(results);
    });
};

module.exports.createProject = function (request, reply) {
    var project = request.payload;
    Project.persist(project, function (err, results) {
        if (err) Boom.wrap(err);
        return reply(results);
    });
};

module.exports.updateProject = function (request, reply) {
    var project = request.payload;
    Project.merge(project, function (err, results) {
        if (err) Boom.wrap(err);
        return reply(results);
    });
};

module.exports.deleteProject = function (request, reply) {
    var projectId = request.params.projectId;
    Project.remove(projectId, function (err, results) {
        if (err) Boom.wrap(err);
        return reply().code(204);
    });
};
