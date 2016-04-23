'use strict';

module.exports.displayApi = function (request, reply) {

    reply({
        'hello': '/hello{/name}',
        'people': '/people{/person_id}',
        'projects': '/projects{/project_id}'
    });
};
