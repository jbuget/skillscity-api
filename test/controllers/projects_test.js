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
const afterEach = lab.after;

const Boom = require('boom');
const Project = require('../../app/models/project');
const Projects = Proxyquire('../../app/controllers/projects', {
    'boom': Boom,
    '../models/project': Project
});

const Server = require('../../app/server');

describe('#listProjects', () => {

    let request = {},
        reply = Sinon.spy();

    afterEach((done) => {
        reply.reset();
        if (Project.list.restore) {
            Project.list.restore();
        }
        done();
    });

    it('should return all the projects (2)', (done) => {
        // given
        const data = [
            {name: 'p1', client: 'c1'},
            {name: 'p2', client: 'c2'},
            {name: 'p3', client: 'c3'}
        ];
        Sinon.stub(Project, 'list', function (callback) {
            callback(null, data);
        });

        //when
        Server.inject({method: "GET", url: "/projects"}, function (response) {

            // then
            response.statusCode.should.equal(200);
            response.result.should.equal(data);
            if (Project.list.restore) {
            Project.list.restore();
            }
            done();
        });
    });

    it('should return all the projects', (done) => {
        // given
        const data = [
            {name: 'p1', client: 'c1'},
            {name: 'p2', client: 'c2'},
            {name: 'p3', client: 'c3'}
        ];
        Sinon.stub(Project, 'list', function (callback) {
            callback(null, data);
        });

        // when
        Projects.listProjects(request, reply);

        // then
        reply.should.have.been.calledWith(data);
        if (Project.list.restore) {
            Project.list.restore();
        }
        done();
    });

    it('should return a Boom wrapping exception in case of error', (done) => {
        // given
        const deep_error = new Error('Soooo dep!');
        Sinon.stub(Project, 'list', function (callback) {
            callback(deep_error, null);
        });
        const boom_wrap = Sinon.spy(Boom, 'wrap');

        // when
        Projects.listProjects(request, reply);

        // then
        boom_wrap.should.have.been.calledWith(deep_error);
        reply.should.have.been.called;
        if (Project.list.restore) {
            Project.list.restore();
        }
        done();
    })

});

describe('#getProject', () => {


});