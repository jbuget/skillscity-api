'use strict';

const hello = require('./controllers/hello').routes;
const people = require('./controllers/people').routes;
const projects = require('./controllers/projects').routes;

module.exports = [].concat(hello, people, projects);