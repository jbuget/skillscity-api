'use strict';

const Proxyquire = require('proxyquire');

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

const Boom = require('boom');
const Project = require('../../app/models/project');

const Server = require('../../app/server');

describe('Projects API', () => {

    describe('GET /projects', () => {

        afterEach((done) => {

            Project.list.restore();
            done();
        });

        it('should return all the projects', (done) => {
            // given
            const projects = [
                { id: 1, name: 'p1', client: 'c1' },
                { id: 2, name: 'p2', client: 'c2' },
                { id: 3, name: 'p3', client: 'c3' }
            ];
            Sinon.stub(Project, 'list', (callback) => {

                callback(null, projects);
            });

            //when
            Server.inject({ method: 'GET', url: '/projects' }, (response) => {

                // then
                response.statusCode.should.equal(200);
                response.result.should.equal(projects);
                done();
            });
        });

        it('should return an internal server error in case of exception', (done) => {
            // given
            Sinon.stub(Project, 'list', (callback) => {

                callback(new Error('Some error'));
            });

            // when
            Server.inject({ method: 'GET', url: '/projects' }, (response) => {

                // then
                response.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('POST /projects', () => {

        afterEach((done) => {

            Project.persist.restore();
            done();
        });

        it('should persist a new project with a generated ID and return it', (done) => {
            // given
            const newProject = { name: 'new_project', client: 'client_name' };
            const persistedProject = { id: 1, name: 'new_project', client: 'client_name' };
            Sinon.stub(Project, 'persist', (project, callback) => {

                callback(null, persistedProject);
            });

            //when
            Server.inject({ method: 'POST', url: '/projects', payload: JSON.stringify(newProject) }, (response) => {

                // then
                response.statusCode.should.equal(200);
                response.payload.should.equal(JSON.stringify(persistedProject));
                done();
            });
        });

        it('should return an internal server error in case of exception', (done) => {

            // given
            const newProject = { name: 'new_project', client: 'client_name' };
            Sinon.stub(Project, 'persist', (project, callback) => {

                callback(new Error('Some error'));
            });

            // when
            Server.inject({ method: 'POST', url: '/projects', payload: JSON.stringify(newProject) }, (response) => {

                // then
                response.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('GET /project/{projectId}', () => {

        afterEach((done) => {

            Project.get.restore();
            done();
        });

        it('should return the project by its ID', (done) => {
            // given
            const project = { id: 123, name: 'project_name', client: 'client_name' };
            Sinon.stub(Project, 'get', (projectId, callback) => {

                callback(null, project);
            });

            // when
            Server.inject({ method: 'GET', url: '/projects/123' }, (response) => {

                // then
                response.statusCode.should.equal(200);
                response.result.should.equal(project);
                done();
            });
        });

        it('should return an internal server error in case of exception', (done) => {
            // given
            Sinon.stub(Project, 'get', (projectId, callback) => {

                callback(new Error('Some error'));
            });

            // when
            Server.inject({ method: 'GET', url: '/projects/123' }, (response) => {

                // then
                response.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('PUT /project/{projectId}', () => {

        afterEach((done) => {

            Project.merge.restore();
            done();
        });

        it('should update the project', (done) => {
            // given
            const originalproject = { id: 123, name: 'project_name', client: 'client_name' };
            const updatedProject = { id: 123, name: 'new_project_name', client: 'new_client_name' };
            Sinon.stub(Project, 'merge', (projectId, callback) => {

                callback(null, updatedProject);
            });

            // when
            Server.inject({ method: 'PUT', url: '/projects/123', payload: JSON.stringify(originalproject) }, (response) => {

                // then
                response.statusCode.should.equal(200);
                response.payload.should.equal(JSON.stringify(updatedProject));
                done();
            });
        });

        it('should return an internal server error in case of exception', (done) => {
            // given
            const project = { id: 123, name: 'project_name', client: 'client_name' };
            Sinon.stub(Project, 'merge', (projectId, callback) => {

                callback(new Error('Some error'));
            });

            // when
            Server.inject({ method: 'PUT', url: '/projects/123', payload: JSON.stringify(project) }, (response) => {

                // then
                response.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('DELETE /project/{projectId}', () => {

        afterEach((done) => {

            Project.del.restore();
            done();
        });

        it('should update the project', (done) => {
            // given
            Sinon.stub(Project, 'del', (projectId, callback) => {

                callback(null);
            });

            // when
            Server.inject({ method: 'DELETE', url: '/projects/123' }, (response) => {

                // then
                response.statusCode.should.equal(204);
                response.payload.should.equal('');
                done();
            });
        });

        it('should return an internal server error in case of exception', (done) => {
            // given
            Sinon.stub(Project, 'del', (projectId, callback) => {

                callback(new Error('Some error'));
            });

            // when
            Server.inject({ method: 'DELETE', url: '/projects/123' }, (response) => {

                // then
                response.statusCode.should.equal(500);
                done();
            });
        });
    });

});

