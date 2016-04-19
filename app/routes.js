'use strict';

const Hello = require('./controllers/hello');
const People = require('./controllers/people');
const Projects = require('./controllers/projects');

const internals = {};

internals.index = function (request, reply) {

    reply('It works!');
};

module.exports = [
    { path: '/', method: 'GET', handler: internals.index },

    { path: '/hello', method: 'GET', handler: Hello.sayHelloWorld },
    { path: '/hello/{name}', method: 'GET', handler: Hello.sayHello },

    { path: '/people', method: 'GET', handler: People.getPeople },
    { path: '/people', method: 'POST', handler: People.synchronizePeople },

    { path: '/projects', method: 'GET', handler: Projects.listProjects },
    { path: '/projects', method: 'POST', handler: Projects.createProject },
    { path: '/projects/{projectId}', method: 'GET', handler: Projects.getProject },
    { path: '/projects/{projectId}', method: 'PUT', handler: Projects.updateProject },
    { path: '/projects/{projectId}', method: 'DELETE', handler: Projects.deleteProject }
];
