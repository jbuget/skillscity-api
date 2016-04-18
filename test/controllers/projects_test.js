'use strict';

const Proxyquire = require('proxyquire');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Sinon = require('sinon');
const Chai = require('chai');
Chai.should();
Chai.use(require('sinon-chai'));

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const afterEach = lab.afterEach;

const Boom = require('boom');
const Project = require('../../app/models/project');

const Server = require('../../app/server');

describe('Projects API', () => {

    before((done) => {
        Proxyquire('../../app/controllers/projects', {
            'boom': Boom,
            '../models/project': Project
        });
        done();
    });

    describe('GET /projects', () => {

        afterEach((done) => {
            Project.list.restore();
            done();
        });

        it('should return all the projects', (done) => {
            // given
            const projects = [
                {id: 1, name: 'p1', client: 'c1'},
                {id: 2, name: 'p2', client: 'c2'},
                {id: 3, name: 'p3', client: 'c3'}
            ];
            Sinon.stub(Project, 'list', function (callback) {
                callback(null, projects);
            });

            //when
            Server.inject({method: "GET", url: "/projects"}, function (response) {

                // then
                response.statusCode.should.equal(200);
                response.result.should.equal(projects);
                done();
            });
        });

        it('should return an internal server error in case of exception', (done) => {
            // given
            Sinon.stub(Project, 'list', function (callback) {
                callback(new Error('Some error'));
            });

            // when
            Server.inject({method: "GET", url: "/projects"}, function (response) {

                // then
                response.statusCode.should.equal(500);
                done();
            });
        })

    });

    describe('GET /project/{projectId}', () => {

        afterEach((done) => {
            Project.get.restore();
            done();
        });

        it('should return the project by its ID', (done) => {
            // given
            const project = {id: 123, name: 'project_name', client: 'client_name'};
            Sinon.stub(Project, 'get', function (projectId, callback) {
                callback(null, project);
            });

            // when
            Server.inject({method: "GET", url: "/projects/123"}, function (response) {

                // then
                response.statusCode.should.equal(200);
                response.result.should.equal(project);
                done();
            });
        });

        it('should return an internal server error in case of exception', (done) => {
            // given
            Sinon.stub(Project, 'get', function (projectId, callback) {
                callback(new Error('Some error'));
            });

            // when
            Server.inject({method: "GET", url: "/projects/123"}, function (response) {

                // then
                response.statusCode.should.equal(500);
                done();
            });
        })

    });

});

