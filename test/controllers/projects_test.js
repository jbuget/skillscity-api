'use strict';

const proxyquire = require('proxyquire');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;

const Chai = require('chai');
Chai.should();

const server = require('../../app/server');

describe('/projects', () => {

/*
    describe('GET /projects', () => {
        it('should fetch all projects', (done) => {
            // given
            var projectStub = {};
            var projects = proxyquire('../../app/controllers/projects', { '../models/project': projectStub });


            // when
            server.inject({method: "GET", url: "/projects"}, function(response) {
                done();
            });
        });
    });
*/

/*
    describe('POST /projects', () => {
        it('should create a new project', (done) => {
            // given

            // when

            // then
            server.inject({method: "POST", url: "/projects"}, function(response) {
                done();
            });
        });
    });

*/
    describe('GET /projects/{projectId}', () => {
        it('should fetch a project', (done) => {
            // given

            // when
            server.inject({method: "GET", url: "/projects/123"}, function(response) {

                // then
                done();
            });
        });
    });

/*
    describe('POST /projects/{projectId}', () => {
        it('should update a project', (done) => {
            // given

            // when
            server.inject({method: "POST", url: "/projects/123"}, function(response) {

                // then
                done();
            });
        });
    });
*/

    describe('DELETE /projects/{projectId}', () => {
        it('should delete a project', (done) => {
            // given

            // when
            server.inject({method: "DELETE", url: "/projects/123"}, function(response) {

                // then
                done();
            });
        });
    });

});
