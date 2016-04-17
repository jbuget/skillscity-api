'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Chai = require('chai');
Chai.should();

const server = require('../../app/server');

lab.experiment("/hello", function() {

    lab.test('/hello', (done) => {
        server.inject({method: "GET", url: "/hello"}, function(response) {
            response.statusCode.should.equal(200);
            response.result.should.equal('Hello, world!');
            done();
        });
    });

    lab.test('/hello/{name}', (done) => {
        server.inject({method: "GET", url: "/hello/John"}, function(response) {
            response.statusCode.should.equal(200);
            response.result.should.equal('Hello, John!');
            done();
        });
    });

});


