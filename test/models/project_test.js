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

// Setup Proxyquire to manage dependency innjection
const Proxyquire = require('proxyquire');

describe('Project model object', () => {

    const cypher = Sinon.spy();
    const Project = Proxyquire('../../app/models/project', {

        '../db': {
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

        it('should store the new project in database with a generated ID', (done) => {
            // given
            const project = { name: 'project_name', client: 'client_name' };
            const callback = 'persist_callback';

            // when
            Project.persist(project, callback);

            // then
            cypher.should.have.been.calledWith({
                query: '' +
                'MERGE (id:UniqueId{name:"Project"}) ' +
                'ON CREATE SET id.count = 1 ' +
                'ON MATCH SET id.count = id.count + 1 ' +
                'WITH id.count AS uid ' +
                'CREATE (p:Project { id: uid, name: "project_name", client: "client_name" }) ' +
                'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
            }, callback);
            done();
        });
    });

    describe('#get', () => {

        it('should fetch a single project by its ID', (done) => {
            // given
            const projectId = 123;
            const callback = Sinon.spy();

            // when
            Project.get(projectId, callback);

            // then
            cypher.should.have.been.calledWith({
                query: '' +
                'MATCH (p:Project {id: 123}) ' +
                'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image ' +
                'LIMIT 1'
            });
            done();
        });
    });

    describe('#del', () => {

        it('should fetch a single project by its ID', (done) => {
            // given
            const projectId = 123;
            const callback = 'del_callback';

            // when
            Project.del(projectId, callback);

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Project {id: 123}) DELETE p'
            }, callback);
            done();
        });
    });

    describe('#list', () => {

        it('should fetch a single project by its ID', (done) => {
            // given
            const callback = 'list_callback';

            // when
            Project.list(callback);

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Project) RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
            }, callback);
            done();
        });
    });

    describe('#merge', () => {

        it('should ', (done) => {
            // given
            const project = {
                id: 123,
                name: 'new_project_name',
                client: 'new_client_name',
                image: 'http://new.image.url'
            };
            const callback = 'merge_callback';

            // when
            Project.merge(project, callback);

            // then
            cypher.should.have.been.calledWith({
                query: '' +
                'MATCH (p:Project { id: ' + project.id + ' }) ' +
                'SET p.name = "' + project.name + '", p.client = "' + project.client + '", p.image = "' + project.image + '" ' +
                'RETURN p.id AS id, p.name AS name, p.client AS client, p.image AS image'
            }, callback);
            done();
        });

    });


});
