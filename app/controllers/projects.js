'use strict';

const Boom = require('boom');
const Project = require('../models/project');
const Path = require('path');
const AWS = require('aws-sdk');
const s3Stream = require('s3-upload-stream')(new AWS.S3());
const ONE_MB = 1048576;

module.exports.listProjects = function (request, reply) {

    Project.list((err, results) => {

        if (err) {
            console.error(err);
            return reply(Boom.wrap(err));
        }
        reply(results);
    });
};

module.exports.getProject = function (request, reply) {

    const projectId = request.params.projectId;
    Project.get(projectId, (err, results) => {

        if (err) {
            console.error(err);
            return reply(Boom.wrap(err));
        }
        reply(results);
    });
};

module.exports.createProject = function (request, reply) {

    const project = request.payload;
    Project.persist(project, (err, results) => {

        if (err) {
            console.error(err);
            return reply(Boom.wrap(err));
        }
        reply(results);
    });
};

module.exports.updateProject = function (request, reply) {

    const project = request.payload;
    Project.merge(project, (err, results) => {

        if (err) {
            console.error(err);
            return reply(Boom.wrap(err));
        }
        reply(results);
    });
};

module.exports.deleteProject = function (request, reply) {

    const projectId = request.params.projectId;
    Project.del(projectId, (err) => {

        if (err) {
            console.error(err);
            return reply(Boom.wrap(err));
        }
        reply().code(204);
    });
};

module.exports.uploadImage = function (request, reply) {

    const projectId = request.params.projectId;
    Project.get(projectId, (err, project) => {

        if (err) {
            console.error(err);
            return reply(Boom.notFound('Project ' + projectId + ' does not exist'));
        }

        const file = request.payload['project-image'];
        const bucketName = 'skillscity';
        const extension = Path.extname(file.hapi.filename);
        const fileKey = 'projects/' + projectId + extension;

        const upload = s3Stream.upload({
            Bucket: bucketName,
            Key: fileKey,
            ACL: 'public-read',
            StorageClass: 'REDUCED_REDUNDANCY',
            ContentType: file.hapi.headers['content-type']
        });
        upload.maxPartSize(ONE_MB);
        upload.on('error', (err) => {

            reply(Boom.wrap(err));
        });
        upload.on('uploaded', (details) => {

            project.image = details.Location;
            Project.merge(project, (err) => {

                if (err) {
                    console.error(err);
                    return reply(Boom.wrap(err));
                }
                return reply(project);
            });
        });
        file.pipe(upload);
    });

};
