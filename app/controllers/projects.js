'use strict';

const Boom = require('boom');
const Project = require('../models/project');
const Path = require('path');
const AWS = require('aws-sdk');
const s3Stream = require('s3-upload-stream')(new AWS.S3());
const ONE_MB = 1048576;

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

    const projectId = request.params.projectId;
    const image = request.payload['project-image'];

    Project.get(projectId)
        .then((project) => internals.uploadImageStreamToAwsS3(project, image))
        .then((project) => Project.merge(project))
        .then((project) => reply(project))
        .catch((err) => internals.replyWithWrappedError(reply, err));
};

internals.replyWithWrappedError = function (reply, err) {

    console.error(err);
    return reply(Boom.wrap(err));
};

internals.uploadImageStreamToAwsS3 = function (project, image) {

    return new Promise((resolve, reject) => {

        const bucketName = 'skillscity';
        const extension = Path.extname(image.hapi.filename);
        const fileKey = 'projects/' + project.id + extension;

        const upload = s3Stream.upload({
            Bucket: bucketName,
            Key: fileKey,
            ACL: 'public-read',
            StorageClass: 'REDUCED_REDUNDANCY',
            ContentType: image.hapi.headers['content-type']
        });

        upload.maxPartSize(ONE_MB);

        upload.on('error', (err) => {

            return reject(err);
        });

        upload.on('uploaded', (details) => {

            project.image = details.Location;
            return resolve(project);
        });
        image.pipe(upload);
    });
};
