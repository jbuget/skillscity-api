'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Chai = require('chai');
Chai.should();

const Server = require('../../app/server');

lab.experiment('/', () => {

    lab.test('/', (done) => {

        Server.inject({ method: 'GET', url: '/' }, (response) => {

            response.statusCode.should.equal(200);
            response.result.should.deep.equal({
                'hello': '/hello{/name}',
                'people': '/people{/person_id}',
                'projects': '/projects{/project_id}'
            });
            done();
        });
    });

});


