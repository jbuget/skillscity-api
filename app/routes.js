'use strict';

const hello = require('./controllers/hello').routes;
const people = require('./controllers/people').routes;
const projects = require('./controllers/projects').routes;

module.exports = [{
    path: '/', method: 'GET', handler: function (request, reply) {
        reply('It works!');
    }
}].concat(hello, people, projects);