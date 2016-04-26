'use strict';

// Setup Lab in BDD mode
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const afterEach = lab.afterEach;

// Setup Sinon + Chai in BDD mode
const Sinon = require('sinon');
const Chai = require('chai');
Chai.should();
Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));

// Setup Proxyquire to manage dependency innjection
const Proxyquire = require('proxyquire');


describe('Project model object', () => {

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

        const newProject = {
            id: null,
            name: 'project_name',
            client: 'client_name',
            image: 'http://image.url'
        };

        it('should store the new project in database with a generated ID', () => {
            // given
            const createdProject = Object.assign({}, newProject);
            createdProject.id = 123;
            cypher.callsArgWith(1, null, createdProject);

            // when
            const actual = Project.persist(newProject);

            // then
            cypher.should.have.been.calledWith({
                query: '' +
                'MERGE (id:UniqueId{name:"Project"}) ' +
                'ON CREATE SET id.count = 1 ' +
                'ON MATCH SET id.count = id.count + 1 ' +
                'WITH id.count AS uid ' +
                'CREATE (p:Project { id: uid, name: "project_name", client: "client_name" }) ' +
                'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
            });
            return actual.should.eventually.equal(createdProject);
        });

        it('should throw an error in case of exception', () => {
            // given
            const err = new Error('Some error');
            cypher.callsArgWith(1, err);

            // when
            const actual = Project.persist(newProject);

            // then
            return actual.should.be.rejectedWith(err);
        });
    });

    describe('#get', () => {

        it('should fetch a single project by its ID', () => {
            // given
            const project = {
                id: 123,
                name: 'project_name',
                client: 'client_name',
                image: 'http://image.url'
            };
            cypher.callsArgWith(1, null, [project]);

            // when
            const actual = Project.get(project.id);

            // then
            cypher.should.have.been.calledWith({
                query: '' +
                'MATCH (p:Project {id: 123}) ' +
                'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image ' +
                'LIMIT 1'
            });
            return actual.should.eventually.equal(project);
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

        it('should fetch a single project by its ID', () => {
            // given
            cypher.callsArgWith(1, null, true);

            // when
            const actual = Project.del(1);

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Project {id: 1}) DELETE p'
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

        it('should fetch a single project by its ID', () => {
            // given
            const projects = [
                { id: 1, name: 'project_1', client: 'client_2', image: 'http://img.1' },
                { id: 2, name: 'project_2', client: 'client_2', image: 'http://img.2' },
                { id: 3, name: 'project_3', client: 'client_3', image: 'http://img.3' }
            ];
            cypher.callsArgWith(1, null, projects);

            // when
            const actual = Project.list();

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Project) RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
            });
            return actual.should.eventually.equal(projects);
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

        const project = {
            id: 123,
            name: 'new_project_name',
            client: 'new_client_name',
            image: 'http://new.image.url'
        };

        it('should update the project', () => {
            // given
            cypher.callsArgWith(1, null, [project]);

            // when
            const actual = Project.merge(project);

            // then
            cypher.should.have.been.calledWith({
                query: '' +
                'MATCH (p:Project { id: ' + project.id + ' }) ' +
                'SET p.name = "' + project.name + '", p.client = "' + project.client + '", p.image = "' + project.image + '" ' +
                'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
            });
            return actual.should.eventually.equal(project);
        });

        it('should throw an error in case of exception', () => {
            // given
            const err = new Error('Some error');
            cypher.callsArgWith(1, err);

            // when
            const actual = Project.merge(project);

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
