'use strict';

module.exports.sayHelloWorld = function (request, reply) {

    reply('Hello, world!');
};

module.exports.sayHello = function (request, reply) {

    reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
};
