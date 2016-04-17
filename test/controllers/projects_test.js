'use strict';

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

    describe('GET /projects', () => {
        it('', (done) => {
            // given

            // when
            server.inject({method: "GET", url: "/projects"}, function(response) {

                // then
                done();
            });
        });
    });

    describe('GET /projects/{projectId}', () => {
        it('', (done) => {
            // given

            // when

            // then
            done();
        });
    });

    describe('POST /projects', () => {
        it('', (done) => {
            // given

            // when

            // then
            done();
        });
    });

    describe('DELETE /projects/{projectId}', () => {
        it('', (done) => {
            // given

            // when

            // then
            done();
        });
    });

});
