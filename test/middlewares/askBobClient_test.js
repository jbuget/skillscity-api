'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const afterEach = lab.afterEach;

const Sinon = require('sinon');
const Chai = require('chai');
Chai.should();
Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));

const AskBobClient = require('../../app/middlewares/askBobClient');

const Request = require('request');

describe('#fetchPeople', () => {

    afterEach((done) => {

        if (Request.get.restore) {
            Request.get.restore();
        }
        done();
    });

    it('should return all Octos retrieved from AskBob API', (done) => {
        // given
        const response = { statusCode: 200 };
        const body = {
            'items': [{
                'nickname': 'PBE',
                'first_name': 'Pierrette',
                'last_name': 'Bertrand',
                'mobile_number': '+33 6 67 35 43 60',
                'email': 'pbertrand@octo.com',
                'tiny_photo': 'http://s3.amazonaws.com/askbob/users/photos/407/tiny/DSC_1897.jpg?1420822837',
                'photo': 'http://s3.amazonaws.com/askbob/users/photos/407/preview/DSC_1897.jpg?1420822837',
                'lob': 'WEBF',
                'manager': 'FPE',
                'entry_date': '2015-01-05',
                'leaving_date': null,
                'level': '2 CC',
                'job': 'Consultant confirm\u00e9'
            }, {
                'nickname': 'JBU',
                'first_name': 'J\u00e9r\u00e9my',
                'last_name': 'Buget',
                'mobile_number': '0620667129',
                'email': 'jbuget@octo.com',
                'tiny_photo': 'http://s3.amazonaws.com/askbob/users/photos/224/tiny/jbu_profile_medium.jpg?1414161627',
                'photo': 'http://s3.amazonaws.com/askbob/users/photos/224/preview/jbu_profile_medium.jpg?1414161627',
                'lob': 'WEBF',
                'manager': 'FPE',
                'entry_date': '2013-02-04',
                'leaving_date': null,
                'level': '3 CS',
                'job': 'Consultant Senior'
            }, {
                'nickname': 'XJU',
                'first_name': 'Xavier',
                'last_name': 'Julien',
                'mobile_number': '+33 6 68 61 20 78',
                'email': 'xjulien@octo.com',
                'tiny_photo': 'http://s3.amazonaws.com/askbob/users/photos/437/tiny/5_Photo.jpg?1428566155',
                'photo': 'http://s3.amazonaws.com/askbob/users/photos/437/preview/5_Photo.jpg?1428566155',
                'lob': 'WEBF',
                'manager': 'FPE',
                'entry_date': '2015-04-08',
                'leaving_date': null,
                'level': '1 C',
                'job': 'Consultant'
            }]
        };
        const people = [{
            nickname: 'PBE',
            first_name: 'Pierrette',
            last_name: 'Bertrand',
            mobile_number: '+33 6 67 35 43 60',
            email: 'pbertrand@octo.com',
            tiny_photo: 'http://s3.amazonaws.com/askbob/users/photos/407/tiny/DSC_1897.jpg?1420822837',
            photo: 'http://s3.amazonaws.com/askbob/users/photos/407/preview/DSC_1897.jpg?1420822837',
            lob: 'WEBF',
            manager: 'FPE',
            entry_date: '2015-01-05',
            leaving_date: null,
            level: '2 CC',
            job: 'Consultant confirm\u00e9'
        }, {
            nickname: 'JBU',
            first_name: 'J\u00e9r\u00e9my',
            last_name: 'Buget',
            mobile_number: '0620667129',
            email: 'jbuget@octo.com',
            tiny_photo: 'http://s3.amazonaws.com/askbob/users/photos/224/tiny/jbu_profile_medium.jpg?1414161627',
            photo: 'http://s3.amazonaws.com/askbob/users/photos/224/preview/jbu_profile_medium.jpg?1414161627',
            lob: 'WEBF',
            manager: 'FPE',
            entry_date: '2013-02-04',
            leaving_date: null,
            level: '3 CS',
            job: 'Consultant Senior'
        }, {
            nickname: 'XJU',
            first_name: 'Xavier',
            last_name: 'Julien',
            mobile_number: '+33 6 68 61 20 78',
            email: 'xjulien@octo.com',
            tiny_photo: 'http://s3.amazonaws.com/askbob/users/photos/437/tiny/5_Photo.jpg?1428566155',
            photo: 'http://s3.amazonaws.com/askbob/users/photos/437/preview/5_Photo.jpg?1428566155',
            lob: 'WEBF',
            manager: 'FPE',
            entry_date: '2015-04-08',
            leaving_date: null,
            level: '1 C',
            job: 'Consultant'
        }];
        Sinon.stub(Request, 'get').callsArgWith(1, null, response, body);

        // when
        const actual = AskBobClient.fetchPeople();

        // then
        return actual.should.eventually.deep.equal(people);
    });

    it('should throw an error in case of exception', () => {
        // given
        const err = new Error('Some error');
        Sinon.stub(Request, 'get').throws(err);

        // when
        const actual = AskBobClient.fetchPeople();

        // then
        return actual.should.be.rejectedWith(err);
    });

    it('should throw an error if status code of the AskBob response is not 200', () => {
        // given
        const response = { statusCode: 500 };
        Sinon.stub(Request, 'get').callsArgWith(1, null, response, {});

        // when
        const actual = AskBobClient.fetchPeople();

        // then
        return actual.should.be.rejected;
    });

    it('should throw an error if status code of the AskBob response return an error', () => {
        // given
        const err = new Error('Some error');
        Sinon.stub(Request, 'get').callsArgWith(1, err, {}, {});

        // when
        const actual = AskBobClient.fetchPeople();

        // then
        return actual.should.be.rejectedWith(err);
    });
});


