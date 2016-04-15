const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const server = require('../server');

lab.experiment("Basic HTTP Tests", function() {

    lab.test('/octos', (done) => {
        var options = {
            method: "GET", url: "/octos"
        };
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.have.length(4);
            done();
        });
    });

});
