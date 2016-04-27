# Stacks API

[![Heroku](https://heroku-badge.herokuapp.com/?app=floating-shore-97213)](https://floating-shore-97213.herokuapp.com/)
[![Build Status](https://travis-ci.org/jbuget/stacks-api.svg?branch=master)](https://travis-ci.org/jbuget/stacks-api)
[![bitHound Overall Score](https://www.bithound.io/github/jbuget/stacks-api/badges/score.svg)](https://www.bithound.io/github/jbuget/stacks-api)
[![bitHound Dependencies](https://www.bithound.io/github/jbuget/stacks-api/badges/dependencies.svg)](https://www.bithound.io/github/jbuget/stacks-api/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/jbuget/stacks-api/badges/devDependencies.svg)](https://www.bithound.io/github/jbuget/stacks-api/master/dependencies/npm)

---

## Installation

### 1/ Prerequesites

- Install [Docker](https://docs.docker.com/)
- Install [NodeJS 5.8+](https://nodejs.org/)

### 2/ Setup a Neo4j database via Docker

Retrieve the [Neo4j Docker image](https://hub.docker.com/_/neo4j/) :

```
$ docker pull neo4j
```

Run a Neo4j container :

```
$ docker run --detach --publish 7474:7474 --volume ~/neo4j/data:/data neo4j
```

In your browser, access [Neo4j Web console](http://192.168.99.100:7474) and change your neo4j account password in order to activate it.

Add some data from the Neo4j Web console :

```
> CREATE (n:Person { nickname: "JDO",first_name: "John",last_name: "Doe",mobile_number: "0612345678",email: "jdoe@mail.com",tiny_photo: "http://s3.amazonaws.com/askbob/users/photos/224/tiny/jdo_profile_medium.jpg?1414161627",photo: "http://s3.amazonaws.com/askbob/users/photos/224/preview/jdo_profile_medium.jpg?1414161627",lob: "WEBF",manager: "FHI",entry_date: "2013-02-04",leaving_date: null,level: "3 CS",job: "Test account" })
```


### 3/ Setup the project

Retrieve the project sources :

```
$ git clone git@github.com:jbuget/stacks-api.git && cd stacks-api
```

Retrieve the NPM dependencies :

```
$ npm install
```

Launch the tests :

```
$ npm test
```

Run the application :

```
$ npm start
```

Check that the application is up access the API index : in a browser via [http://localhost:3000](http://localhost:3000).

Or in a console :

```
$ curl -G 'http://localhost:3000'
```


### (optionnal) 4/ Setup Travis & Heroku CLI tools

- Install the [Travis CI CLI](https://github.com/travis-ci/travis.rb#installation)
- Install the [Heroku Toolbelt](https://toolbelt.heroku.com/)


---

## Anatomy of the application

```
skills-city-api
 └ app                     → Application sources
    └ controllers          → Controller classes defining routes, handlers and requests/responses schema validation
    └ middlewares          → Middleware classes such as API (ex: AskBob or AWS S3) or DB clients
    └ models               → Model objects containing business and persistance intelligence
    └ db.js                → Database definition
    └ routes.js            → Routes definition
    └ server.js            → Hapi server definition
 └ build                   → (unversionned) Generated sources or output
    └ coverage.html        → HTML report of Lab testing tool (tests status + code coverage + linting results)
 └ config                  → Configurations files
    └ default.json         → Default configuration file
    └ {environment}.json   → Environment specific configuration file, based on NODE_ENV environment variable
    └ local.json           → (unversionned) Local configuration file
 └ node_modules            → (unversionned) Downloaded Node dependencies
 └ test                    → Source folder for unit or functional tests
    └ resources            → Files used in tests, such as images (ex: test.png) or data sets
 └ .gitignore              → Git ignored files configuration
 └ .travis.yml             → Travis CI configuration file
 └ apiary.apib             → API Blueprint specifications
 └ dredd.yml               → Dredd configuration file (Dredd is a language-agnostic HTTP API testing framework)
 └ package.json            → Node scripts & dependencies declaration
 └ Procfile                → Heroku configuration file
 └ README.md               → Project documentation
```


---

## Managing environments

We use [node-config](https://github.com/lorenwest/node-config) plugin to manage multi-environment runtime.

In particular, we manage environment specific configuration (DB, SMTP, variables, etc.) via [NODE_ENV environment variable](https://github.com/lorenwest/node-config/wiki/Environment-Variables#node_env).

If NODE_ENV variable is not defined, then ```config/default.json``` configuration file will be used.

If it is defined (known values are 'stage' or 'production'), then the corresponding environment configuration file (ex: ```config/stage.json```) will be used.

**Warning!** If a ```config/local.json``` file is defined, it will be used, even if the NODE_ENV variable is set, according to the [node-config file load order](https://github.com/lorenwest/node-config/wiki/Configuration-Files#file-load-order).


---

## Debugging

### HTTP REST requests

We use [node-request](https://github.com/request/request) plugin to make HTTP requests.

To see DEBUG traces, just declare ```Request.debug = true``` as following :
```node
const Request = require('request');
Request.debug = true;
```

You can also use the [request-debug](https://github.com/request/request-debug) plugin

```
const Request = require('request');
require('request-debug')(Request);
```

[Other techniques](https://github.com/request/request#debugging) are described in the offical documentation.


---

## Testing

### Usage

To basically run the tests, just run the following command :

```
$ npm test
```

### Lab as the tests execution engine

We use [Lab](https://github.com/hapijs/lab) as the tests execution engine. Lab is smaller, simpler and lighter than Mocha. Moreover, it provides easy Code Coverage and Linting reports.

Initialising Lab in a test file requires :

```
const Lab = require('lab');
const lab = exports.lab = Lab.script();
```

Lab proposes different test styles :

- Experiment style
- BDD style
- TDD style

We recommand to use BDD style because it encourages to think in a functional way and because it could be easier to migrate from Lab to Mocha or Jasmine if needed.

### Chai for fluent assertions

[Chai](http://chaijs.com/) is a BDD / TDD assertion library for node and the browser.

We could have used [Code](https://github.com/hapijs/code) assertion library, but Chai offers `should` style assertions and some cool [plugins](http://chaijs.com/plugins/), like [chai-as-promised](http://chaijs.com/plugins/chai-as-promised/).

### Sinon for test doubles (spies, stubs & mocks)

[Sinon](sinonjs.org) is a test utility used for creating and managing double objects such as spies, stubs and mocks.

Sinon is highly extensible. Thus, to make Sinon working with Chai, we use [sinon-chai](https://github.com/domenic/sinon-chai). And for stubbing promises, we use [sinon-as-promised](https://github.com/bendrucker/sinon-as-promised).

### Proxyquire for mocking dependencies

Sometimes we need to take hold of modules dependencies (loaded via `require`). Then we use [Proxyquire](https://github.com/thlorenz/proxyquire).


---

## Code quality

### Usage

In order to run code quality check task:

```
$ npm run code-check
```

This task will :

 1. run the tests
 2. calculate the code coverage
 3. check code format
 4. generates a full HTML report in `build/coverage.html`


### Code Coverage

Lab provides built-in code coverage feature (option `-c` for `--coverage`) originally adapted from [Blanket.js](http://blanketjs.org/).

### Code Checking

Linting is the process of running a program that will analyse code for potential errors. By default, Lab uses [ESLint](http://eslint.org/).

Note that, by default, Lab disables linting. To enable linting, you must set option `-L` (for `--lint`).


---

## Release & deployment

### Configuration

We use [Config](https://github.com/lorenwest/node-config) node library.

### Heroku pipeline

TODO
