'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;

const Sinon = require('sinon');
require('sinon-as-promised');
const Chai = require('chai');
Chai.should();
Chai.use(require('sinon-chai'));

const Fs = require('fs');
const FormData = require('form-data');
const StreamToPromise = require('stream-to-promise');

const Project = require('../../app/models/project');
const AwsS3Client = require('../../app/middlewares/awsS3Client');

const Server = require('../../app/server');

describe('GET /projects', () => {

    afterEach((done) => {

        Project.list.restore();
        done();
    });

    it('should return all the projects', (done) => {
        // given
        const projects = [
            { id: 1, name: 'p1', client: 'c1', image: null },
            { id: 2, name: 'p2', client: 'c2', image: null },
            { id: 3, name: 'p3', client: 'c3', image: null }
        ];
        Sinon.stub(Project, 'list').resolves(projects);

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
        Sinon.stub(Project, 'list').rejects(new Error('Some error'));

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
        Sinon.stub(Project, 'persist').resolves(persistedProject);

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
        Sinon.stub(Project, 'persist').rejects(new Error('Some error'));

        // when
        Server.inject({ method: 'POST', url: '/projects', payload: JSON.stringify(newProject) }, (response) => {

            // then
            response.statusCode.should.equal(500);
            done();
        });
    });
});

describe('GET /projects/{projectId}', () => {

    afterEach((done) => {

        Project.get.restore();
        done();
    });

    it('should return the project by its ID', (done) => {
        // given
        const project = { id: 123, name: 'project_name', client: 'client_name' };
        Sinon.stub(Project, 'get').resolves(project);

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
        Sinon.stub(Project, 'get').rejects(new Error('Some error'));

        // when
        Server.inject({ method: 'GET', url: '/projects/123' }, (response) => {

            // then
            response.statusCode.should.equal(500);
            done();
        });
    });
});

describe('PUT /projects/{projectId}', () => {

    afterEach((done) => {

        Project.merge.restore();
        done();
    });

    it('should update the project', (done) => {
        // given
        const originalproject = { id: 123, name: 'project_name', client: 'client_name' };
        const updatedProject = { id: 123, name: 'new_project_name', client: 'new_client_name' };
        Sinon.stub(Project, 'merge').resolves(updatedProject);

        // when
        Server.inject({
            method: 'PUT',
            url: '/projects/123',
            payload: JSON.stringify(originalproject)
        }, (response) => {

            // then
            response.statusCode.should.equal(200);
            response.payload.should.equal(JSON.stringify(updatedProject));
            done();
        });
    });

    it('should return an internal server error in case of exception', (done) => {
        // given
        const project = { id: 123, name: 'project_name', client: 'client_name' };
        Sinon.stub(Project, 'merge').rejects(new Error('Some error'));

        // when
        Server.inject({ method: 'PUT', url: '/projects/123', payload: JSON.stringify(project) }, (response) => {

            // then
            response.statusCode.should.equal(500);
            done();
        });
    });
});

describe('DELETE /projects/{projectId}', () => {

    afterEach((done) => {

        Project.del.restore();
        done();
    });

    it('should update the project', (done) => {
        // given
        Sinon.stub(Project, 'del').resolves(true);

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
        Sinon.stub(Project, 'del').rejects(new Error('Some error'));

        // when
        Server.inject({ method: 'DELETE', url: '/projects/123' }, (response) => {

            // then
            response.statusCode.should.equal(500);
            done();
        });
    });
});

describe('POST /projects/{projectId}/image', () => {

    let form;
    let headers;

    beforeEach((done) => {

        form = new FormData();
        form.append('project-image', Fs.createReadStream('./test/resources/test.png'));
        headers = form.getHeaders();
        done();
    });

    afterEach((done) => {

        if (Project.get.restore) {
            Project.get.restore();
        }
        if (AwsS3Client.uploadStreamToAwsS3.restore) {
            AwsS3Client.uploadStreamToAwsS3.restore();
        }
        if (Project.merge.restore) {
            Project.merge.restore();
        }
        done();
    });

    it('should upload the image to AWS S3, update the project image URL and return it', (done) => {
        // given
        const projectId = 123;
        const project = { id: projectId, name: 'project_name', client: 'client_name', image: null };
        Sinon.stub(Project, 'get').resolves(project);
        Sinon.stub(AwsS3Client, 'uploadStreamToAwsS3').resolves({
            Location: 'http://aws.s3.img.url/projects/123.png'
        });
        Sinon.stub(Project, 'merge').resolves(project);

        // when
        StreamToPromise(form).then((payload) => {

            Server.inject({
                method: 'POST',
                url: '/projects/' + projectId + '/image',
                payload: payload,
                headers: headers
            }, (response) => {
                // then
                response.statusCode.should.equal(200);
                Project.get.should.have.been.called;
                AwsS3Client.uploadStreamToAwsS3.should.have.been.called;
                Project.merge.should.have.been.called;
                done();
            });
        });
    });

    it('should reply an error 400 when project does not exist', (done) => {
        // given
        Sinon.stub(Project, 'get').rejects(new Error('project not found'));

        // when
        StreamToPromise(form).then((payload) => {

            Server.inject({
                method: 'POST',
                url: '/projects/9999/image',
                payload: payload,
                headers: headers
            }, (response) => {
                // then
                response.statusCode.should.equal(500);
                const expectedError = JSON.parse(response.payload);
                expectedError.message.should.equal('An internal server error occurred');
                done();
            });
        });
    });

});

describe('DELETE /projects', () => {

    afterEach((done) => {

        Project.empty.restore();
        done();
    });

    it('should remove all projects in DB', (done) => {
        // given
        Sinon.stub(Project, 'empty').resolves(true);

        // when
        Server.inject({ method: 'DELETE', url: '/projects' }, (response) => {

            // then
            response.statusCode.should.equal(204);
            response.payload.should.equal('');
            done();
        });
    });

    it('should reply with an error in case of exception', (done) => {
        // given
        Sinon.stub(Project, 'empty').rejects(new Error('Some error'));

        // when
        Server.inject({ method: 'DELETE', url: '/projects' }, (response) => {

            // then
            response.statusCode.should.equal(500);
            done();
        });
    });

});

