'use strict';

const Hello = require('./controllers/hello');
const People = require('./controllers/people');

module.exports = [
    {path: '/', method: 'GET', handler: Hello.sayHelloWorld},
    {path: '/hello', method: 'GET', handler: Hello.sayHelloWorld},
    {path: '/hello/{name}', method: 'GET', handler: Hello.sayHello},
    {path: '/people', method: 'GET', handler: People.getPeople},
    {path: '/people', method: 'POST', handler: People.synchronizePeople}
];