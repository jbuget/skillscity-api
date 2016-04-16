const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const server = require('../app/server');

lab.experiment("Basic HTTP Tests", function() {

    lab.test('/', (done) => {
        server.inject({method: "GET", url: "/"}, function(response) {
            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal('Hello, world!');
            done();
        });
    });

});
