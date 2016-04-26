'use strict';

module.exports.sayHelloWorld = function (request, reply) {

    reply({ message: 'Hello, world!' });
};

module.exports.sayHello = function (request, reply) {

    reply({ message: 'Hello, ' + encodeURIComponent(request.params.name) + '!' });
};
