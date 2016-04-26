'use strict';

const Boom = require('boom');
const Project = require('../models/project');
const Path = require('path');
const AwsS3Client = require('../middlewares/awsS3Client');

const internals = {};

module.exports.listProjects = function (request, reply) {

    Project.list()
        .then((projects) => reply(projects))
        .catch((err) => internals.replyWithWrappedError(reply, err));
};

module.exports.emptyProjects = function (request, reply) {

    Project.empty()
        .then(() => reply().code(204))
        .catch((err) => internals.replyWithWrappedError(reply, err));
};

module.exports.getProject = function (request, reply) {

    const projectId = request.params.projectId;
    Project.get(projectId)
        .then((project) => reply(project))
        .catch((err) => internals.replyWithWrappedError(reply, err));
};

module.exports.createProject = function (request, reply) {

    const project = request.payload;
    Project.persist(project)
        .then((createdProject) => reply(createdProject))
        .catch((err) => internals.replyWithWrappedError(reply, err));
};

module.exports.updateProject = function (request, reply) {

    const project = request.payload;
    Project.merge(project)
        .then((updatedProject) => reply(updatedProject))
        .catch((err) => internals.replyWithWrappedError(reply, err));
};

module.exports.deleteProject = function (request, reply) {

    const projectId = request.params.projectId;
    Project.del(projectId)
        .then(() => reply().code(204))
        .catch((err) => internals.replyWithWrappedError(reply, err));
};

module.exports.uploadImage = function (request, reply) {

    let project;
    const projectId = request.params.projectId;

    Project.get(projectId)
        .then((retrievedProject) => {

            const file = request.payload['project-image'];
            const extension = Path.extname(file.hapi.filename);
            const key = 'projects/' + projectId + extension;
            const contentType = file.hapi.headers['content-type'];

            project = retrievedProject;
            return AwsS3Client.uploadStreamToAwsS3(file, key, contentType);
        })
        .then((details) => {

            project.image = details.Location;
            return Project.merge(project);
        })
        .then((updatedProject) => reply(updatedProject))
        .catch((err) => internals.replyWithWrappedError(reply, err));
};

internals.replyWithWrappedError = function (reply, err) {

    console.error(err);
    return reply(Boom.wrap(err));
};
