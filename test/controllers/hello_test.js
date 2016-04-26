'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Chai = require('chai');
Chai.should();

const Server = require('../../app/server');

lab.experiment('/hello', () => {

    lab.test('/hello', (done) => {

        Server.inject({ method: 'GET', url: '/hello' }, (response) => {

            response.statusCode.should.equal(200);
            response.result.should.deep.equal({ message: 'Hello, world!' });
            done();
        });
    });

    lab.test('/hello/{name}', (done) => {

        Server.inject({ method: 'GET', url: '/hello/John' }, (response) => {

            response.statusCode.should.equal(200);
            response.result.should.deep.equal({ message: 'Hello, John!' });
            done();
        });
    });

});


