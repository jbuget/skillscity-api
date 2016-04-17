'use strict';

let internals = {};

internals.sayHelloWorld = function (request, reply) {
    reply('Hello, world!');
};

internals.sayHello = function (request, reply) {
    reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
};

module.exports.routes = [
    {path: '/hello', method: 'GET', handler: internals.sayHelloWorld},
    {path: '/hello/{name}', method: 'GET', handler: internals.sayHello}
];
