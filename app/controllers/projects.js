'use strict';

const Boom = require('boom');
const Project = require('../models/project');

let internals = {};

internals.listProjects = function (request, reply) {
    Project.list(function (err, results) {
        if (err) Boom.wrap(err);
        return reply(results);
    });
};

internals.getProject = function (request, reply) {
    var projectId = request.params.projectId;
    Project.get(projectId, function (err, results) {
        if (err) Boom.wrap(err);
        return reply(results);
    });
};

internals.createProject = function (request, reply) {
    var project = request.payload;
    Project.persist(project, function (err, results) {
        if (err) Boom.wrap(err);
        return reply(results);
    });
};

internals.updateProject = function (request, reply) {
    var project = request.payload;
    Project.merge(project, function (err, results) {
        if (err) Boom.wrap(err);
        return reply(results);
    });
};

internals.deleteProject = function (request, reply) {
    var projectId = request.params.projectId;
    Project.remove(projectId, function (err, results) {
        if (err) Boom.wrap(err);
        return reply().code(204);
    });
};

module.exports.routes = [
    {path: '/projects', method: 'GET', handler: internals.listProjects},
    {path: '/projects', method: 'POST', handler: internals.createProject},
    {path: '/projects/{projectId}', method: 'GET', handler: internals.getProject},
    {path: '/projects/{projectId}', method: 'POST', handler: internals.updateProject},
    {path: '/projects/{projectId}', method: 'DELETE', handler: internals.deleteProject}
];