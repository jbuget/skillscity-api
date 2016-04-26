'use strict';

const Api = require('./controllers/api');
const Hello = require('./controllers/hello');
const People = require('./controllers/people');
const Projects = require('./controllers/projects');

module.exports = [
    { path: '/', method: 'GET', handler: Api.displayApi },

    { path: '/hello', method: 'GET', handler: Hello.sayHelloWorld },
    { path: '/hello/{name}', method: 'GET', handler: Hello.sayHello },

    { path: '/people', method: 'GET', handler: People.getPeople },
    { path: '/people', method: 'POST', handler: People.synchronizePeople },

    { path: '/projects', method: 'GET', handler: Projects.listProjects },
    { path: '/projects', method: 'POST', handler: Projects.createProject },
    { path: '/projects', method: 'DELETE', handler: Projects.emptyProjects },
    { path: '/projects/{projectId}', method: 'GET', handler: Projects.getProject },
    { path: '/projects/{projectId}', method: 'PUT', handler: Projects.updateProject },
    { path: '/projects/{projectId}', method: 'DELETE', handler: Projects.deleteProject },
    {
        path: '/projects/{projectId}/image',
        method: 'POST',
        config: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },
            handler: Projects.uploadImage
        }
    }
];
