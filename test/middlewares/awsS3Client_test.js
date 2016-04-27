'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const afterEach = lab.afterEach;

const Sinon = require('sinon');
const Chai = require('chai');
Chai.should();
Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));

const AWS = require('aws-sdk');
const AwsS3Client = require('../../app/middlewares/awsS3Client');

describe('#uploadStreamToAwsS3', () => {

    const upload = Sinon.stub();
    const stream = 'titi';
    const key = 'toto';
    const contentType = 'image/png';

    before((done) => {

        Sinon.stub(AWS, 'S3').returns({
            upload: upload
        });
        done();
    });

    afterEach((done) => {

        if (upload.restore) {
            upload.restore();
        }
        done();
    });

    it('should send file stream to AWS S3 bucket', () => {
        //given
        const response = { Location: 'http://aws.s3.img' };
        upload.callsArgWith(1, null, response);

        // when
        const actual = AwsS3Client.uploadStreamToAwsS3(stream, key, contentType);

        // then
        upload.should.have.been.calledWith({
            ACL: 'public-read',
            Body: stream,
            Bucket: 'skillscity',
            ContentType: contentType,
            Key: key
        });
        return actual.should.eventually.equal(response);
    });

    it('should throw an error in case of exception', () => {
        // given
        const err = new Error('Some error');
        upload.callsArgWith(1, err);

        // when
        const actual = AwsS3Client.uploadStreamToAwsS3(stream, key, contentType);

        // then
        return actual.should.be.rejectedWith(err);
    });
});
