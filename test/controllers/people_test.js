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

const Person = require('../../app/models/person');

const Server = require('../../app/server');

describe('Projects API', () => {

    describe('GET /people', () => {

        afterEach((done) => {

            Person.list.restore();
            done();
        });

        it('should return all the projects', (done) => {
            // given
            const people = [
                { nickname: 'Batman', firstName: 'Bruce', lastName: 'Wayne' },
                { nickname: 'Superman', firstName: 'Clark', lastName: 'Kent' },
                { nickname: 'Wonder woman', firstName: 'Diana', lastName: 'Prince' }
            ];
            Sinon.stub(Person, 'list', (callback) => {

                callback(null, people);
            });

            //when
            Server.inject({ method: 'GET', url: '/people' }, (response) => {

                // then
                response.statusCode.should.equal(200);
                response.result.should.equal(people);
                done();
            });
        });
    });

    describe('POST /people', () => {

    });

});
