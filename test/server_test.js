const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const server = require('../app/server');

lab.experiment("Basic HTTP Tests", function() {

    lab.test('/people', (done) => {
        var options = {
            method: "GET", url: "/people"
        };
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.have.length(4);
            done();
        });
    });

});
