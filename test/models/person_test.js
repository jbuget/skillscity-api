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

const Proxyquire = require('proxyquire');

describe('Person model object', () => {

    const cypher = Sinon.spy();
    const Project = Proxyquire('../../app/models/person', {

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

    describe('#empty', () => {

        it('should delete all Person node', (done) => {
            // given
            const callback = 'empty_callback';

            // when
            Project.empty(callback);

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Person) DELETE p'
            }, callback);
            done();
        });
    });

    describe('#createList', () => {

    });

    describe('#list', () => {

        it('should fetch a single person by its ID', (done) => {
            // given
            const callback = 'list_callback';

            // when
            Project.list(callback);

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Person) RETURN p.nickname AS nickname, p.firstName AS firstName, p.lastName AS lastName'
            }, callback);
            done();
        });
    });

});

