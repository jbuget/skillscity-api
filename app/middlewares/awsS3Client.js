'use strict';

const AWS = require('aws-sdk');
const Config = require('config');

module.exports.uploadStreamToAwsS3 = function (stream, key, contentType) {

    return new Promise((resolve, reject) => {

        const s3 = new AWS.S3();
        const params = {
            ACL: 'public-read',
            Body: stream,
            Bucket: Config.get('s3.bucket'),
            ContentType: contentType,
            Key: key
        };
        s3.upload(params, (err, data) => {

            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
};
