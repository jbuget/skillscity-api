'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const afterEach = lab.afterEach;

const Sinon = require('sinon');
require('sinon-as-promised');
const Chai = require('chai');
Chai.should();
Chai.use(require('sinon-chai'));

const Person = require('../../app/models/person');
const AskBobClient = require('../../app/middlewares/askBobClient');

const Server = require('../../app/server');

describe('GET /people', () => {

    afterEach((done) => {

        Person.list.restore();
        done();
    });

    it('should return all the people', (done) => {
        // given
        const people = [
            { nickname: 'Batman', firstName: 'Bruce', lastName: 'Wayne' },
            { nickname: 'Superman', firstName: 'Clark', lastName: 'Kent' },
            { nickname: 'Wonder woman', firstName: 'Diana', lastName: 'Prince' }
        ];
        Sinon.stub(Person, 'list').resolves(people);

        //when
        Server.inject({ method: 'GET', url: '/people' }, (response) => {

            // then
            response.statusCode.should.equal(200);
            response.result.should.equal(people);
            done();
        });
    });

    it('should return an internal server error in case of exception', (done) => {
        // given
        Sinon.stub(Person, 'list').rejects(new Error('Some error'));

        // when
        Server.inject({ method: 'GET', url: '/people' }, (response) => {

            // then
            response.statusCode.should.equal(500);
            done();
        });
    });
});

describe('POST /people', () => {

    afterEach((done) => {

        if (Person.empty.restore) {
            Person.empty.restore();
        }
        if (AskBobClient.fetchPeople.restore) {
            AskBobClient.fetchPeople.restore();
        }
        if (Person.createList.restore) {
            Person.createList.restore();
        }
        done();
    });

    it('should synchronize people from AskBob', (done) => {
        // given
        const octos = {
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
        const people = [
            { nickname: 'PBE', firstName: 'Pierrette', lastName: 'Bertrand' },
            { nickname: 'JBU', firstName: 'J\u00e9r\u00e9my', lastName: 'Buget' },
            { nickname: 'XJU', firstName: 'Xavier', lastName: 'Julien' }
        ];
        Sinon.stub(Person, 'empty').resolves(true);
        Sinon.stub(AskBobClient, 'fetchPeople').resolves(octos);
        Sinon.stub(Person, 'createList').resolves(people);

        //when
        Server.inject({ method: 'POST', url: '/people' }, (response) => {
            // then
            response.statusCode.should.equal(200);
            response.payload.should.equal(JSON.stringify(people));
            done();
        });
    });

    it('should return an internal server error in case of exception', (done) => {
        // given
        Sinon.stub(Person, 'empty').rejects(new Error('Some error'));

        // when
        Server.inject({ method: 'POST', url: '/people' }, (response) => {

            // then
            response.statusCode.should.equal(500);
            done();
        });
    });
});
