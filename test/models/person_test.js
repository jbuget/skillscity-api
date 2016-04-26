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

describe('Person model object', () => {

    const cypher = Sinon.stub();
    const Person = Proxyquire('../../app/models/person', {

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

    describe('#empty', () => {

        it('should delete all people', () => {
            // given
            cypher.callsArgWith(1, null);

            // when
            const actual = Person.empty();

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Person) DELETE p'
            });
            return actual.should.eventually.equal(true);
        });

        it('should throw an error in case of exception', () => {
            // given
            const err = new Error('Some error');
            cypher.callsArgWith(1, err);

            // when
            const actual = Person.empty();

            // then
            return actual.should.be.rejectedWith(err);
        });
    });

    describe('#createList', () => {

        const people = [
            { nickname: 'PBE', firstName: 'Pierrette', lastName: 'Bertrand' },
            { nickname: 'JBU', firstName: 'Jérémy', lastName: 'Buget' },
            { nickname: 'XJU', firstName: 'Xavier', lastName: 'Julien' }
        ];

        it('should create a list of project', () => {
            // given
            cypher.callsArgWith(1, null, people);

            // when
            const actual = Person.createList(people);

            // then
            cypher.should.have.been.calledWith({
                query: '' +
                'UNWIND ' + people + ' AS people ' +
                'CREATE (p:Person) SET p = people ' +
                'RETURN p.nickname AS nickname, p.first_name AS firstName, p.last_name AS lastName'
            });
            return actual.should.eventually.equal(people);
        });

        it('should throw an error in case of exception', () => {
            // given
            const err = new Error('Some error');
            cypher.callsArgWith(1, err);

            // when
            const actual = Person.createList(people);

            // then
            return actual.should.be.rejectedWith(err);
        });
    });

    describe('#list', () => {

        const people = [
            { nickname: 'PBE', firstName: 'Pierrette', lastName: 'Bertrand' },
            { nickname: 'JBU', firstName: 'Jérémy', lastName: 'Buget' },
            { nickname: 'XJU', firstName: 'Xavier', lastName: 'Julien' }
        ];

        it('should fetch a single person by its ID', () => {
            // given
            cypher.callsArgWith(1, null, people);

            // when
            const actual = Person.list();

            // then
            cypher.should.have.been.calledWith({
                query: 'MATCH (p:Person) RETURN p.nickname AS nickname, p.first_name AS firstName, p.last_name AS lastName'
            });
            return actual.should.eventually.equal(people);
        });

        it('should throw an error in case of exception', () => {
            // given
            const err = new Error('Some error');
            cypher.callsArgWith(1, err);

            // when
            const actual = Person.list();

            // then
            return actual.should.be.rejectedWith(err);
        });
    });
});

