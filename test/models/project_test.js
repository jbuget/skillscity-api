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

const Proxyquire = require('proxyquire');

const Uuid = require('uuid');

describe('Project model object', () => {

    const projectUuid = '109156be-c4fb-41ea-b1b4-efe1671c5836';
    Sinon.stub(Uuid, 'v4').returns(projectUuid);
    const cypher = Sinon.stub();
    const Project = Proxyquire('../../app/models/project', {

        '../middlewares/db': {
            db: () => {

                return {
                    cypher: cypher
                };
            }
        }
    });

    afterEach((done) => {

        cypher.reset();
        done();
    });

    describe('#persist', () => {

        it('should store the new project in database with a generated ID', () => {
            // given
            const newProject = {
                name: 'foo',
                client: 'bar'
            };

            const createdProject = Object.assign({}, newProject);
            createdProject.uuid = projectUuid;

            const neo4jResults = [{ p: createdProject }];
            cypher.callsArgWith(1, null, neo4jResults);

            // when
            const actual = Project.persist(newProject);

            // then
            cypher.should.have.been.calledWith({
                query: 'CREATE (p:Project { props } ) RETURN p',
                params: {
                    props: createdProject
                },
                lean: true
            });
            return actual.should.eventually.deep.equal(createdProject);
        });

        it('should throw an error in case of exception', () => {
            // given
            const err = new Error('Some error');
            cypher.callsArgWith(1, err);

            // when
            const actual = Project.persist({});

            // then
            return actual.should.be.rejectedWith(err);
        });
    });

    describe('#get', () => {

        it('should fetch a single project by its UUID', () => {
            // given
            const project = {
                uuid: projectUuid,
                name: 'project_name',
                client: 'client_name',
                image: 'http://image.url'
            };
            const neo4jResults = [{ p: project }];
            cypher.callsArgWith(1, null, neo4jResults);

            // when
            const actual = Project.get(projectUuid);

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Project { uuid: { uuid } }) RETURN p',
                params: { uuid: projectUuid },
                lean: true
            });
            return actual.should.eventually.deep.equal(project);
        });

        it('should throw an error in case of exception', () => {
            // given
            const err = new Error('Some error');
            cypher.callsArgWith(1, err);

            // when
            const actual = Project.get(1);

            // then
            return actual.should.be.rejectedWith(err);
        });
    });

    describe('#del', () => {

        it('should delete a project by its UUID', () => {
            // given
            cypher.callsArgWith(1, null, true);

            // when
            const actual = Project.del(projectUuid);

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Project { uuid: { uuid } }) DELETE p',
                params: { uuid: projectUuid },
                lean: true
            });
            return actual.should.eventually.equal(true);
        });

        it('should throw an error in case of exception', () => {
            // given
            const err = new Error('Some error');
            cypher.callsArgWith(1, err);

            // when
            const actual = Project.del(1);

            // then
            return actual.should.be.rejectedWith(err);
        });

    });

    describe('#list', () => {

        it('should return all the projects', () => {
            // given
            const neo4jResults = [
                { p: { uuid: 1, name: 'project_1', client: 'client_2', image: 'http://img.1' } },
                { p: { uuid: 2, name: 'project_2', client: 'client_2', image: 'http://img.2' } },
                { p: { uuid: 3, name: 'project_3', client: 'client_3', image: 'http://img.3' } }
            ];
            const expectedProjects = [
                { uuid: 1, name: 'project_1', client: 'client_2', image: 'http://img.1' },
                { uuid: 2, name: 'project_2', client: 'client_2', image: 'http://img.2' },
                { uuid: 3, name: 'project_3', client: 'client_3', image: 'http://img.3' }
            ];
            cypher.callsArgWith(1, null, neo4jResults);

            // when
            const actual = Project.list();

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Project) RETURN p',
                lean: true
            });
            return actual.should.eventually.deep.equal(expectedProjects);
        });

        it('should throw an error in case of exception', () => {
            // given
            const err = new Error('Some error');
            cypher.callsArgWith(1, err);

            // when
            const actual = Project.list();

            // then
            return actual.should.be.rejectedWith(err);
        });

    });

    describe('#merge', () => {

        it('should update the project', () => {
            // given
            const project = {
                uuid: projectUuid,
                name: 'new_project_name',
                client: 'new_client_name',
                image: 'http://new.image.url'
            };
            const neo4jResults = [{ p: project }];

            cypher.callsArgWith(1, null, neo4jResults);

            // when
            const actual = Project.merge(project);

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Project { uuid: { uuid } }) SET p += { props } RETURN p',
                params: {
                    uuid: projectUuid,
                    props: project
                },
                lean: true
            });
            return actual.should.eventually.deep.equal(project);
        });

        it('should throw an error in case of exception', () => {
            // given
            const err = new Error('Some error');
            cypher.callsArgWith(1, err);

            // when
            const actual = Project.merge({});

            // then
            return actual.should.be.rejectedWith(err);
        });
    });

    describe('#empty', () => {

        it('should delete all projects', () => {
            // given
            cypher.callsArgWith(1, null);

            // when
            const actual = Project.empty();

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Project) DELETE p'
            });
            return actual.should.eventually.equal(true);
        });

        it('should throw an error in case of exception', () => {
            // given
            const err = new Error('Some error');
            cypher.callsArgWith(1, err);

            // when
            const actual = Project.empty();

            // then
            return actual.should.be.rejectedWith(err);
        });
    });
});
