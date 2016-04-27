'use strict';

const AWS = require('aws-sdk');
const s3Stream = require('s3-upload-stream')(new AWS.S3());
const Config = require('config');
const ONE_MB = 1048576;

module.exports.uploadStreamToAwsS3 = function (stream, key, contentType) {

    return new Promise((resolve, reject) => {

        const upload = s3Stream.upload({
            Bucket: Config.get('s3.bucket'),
            Key: key,
            ACL: 'public-read',
            StorageClass: 'REDUCED_REDUNDANCY',
            ContentType: contentType
        });

        upload.maxPartSize(ONE_MB);

        upload.on('error', (err) => {

            return reject(err);
        });

        upload.on('uploaded', (details) => {

            return resolve(details);
        });
        stream.pipe(upload);
    });
};
