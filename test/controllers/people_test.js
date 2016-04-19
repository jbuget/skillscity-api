'use strict';

const Proxyquire = require('proxyquire');

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const afterEach = lab.afterEach;

const Sinon = require('sinon');
const Chai = require('chai');
Chai.should();
Chai.use(require('sinon-chai'));

const Boom = require('boom');

const Project = require('../../app/models/project');

const Server = require('../../app/server');

