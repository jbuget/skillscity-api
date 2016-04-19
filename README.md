# Stacks API

[![Heroku](https://heroku-badge.herokuapp.com/?app=floating-shore-97213)](https://floating-shore-97213.herokuapp.com/)
[![Build Status](https://travis-ci.org/jbuget/stacks-api.svg?branch=master)](https://travis-ci.org/jbuget/stacks-api)
[![bitHound Overall Score](https://www.bithound.io/github/jbuget/stacks-api/badges/score.svg)](https://www.bithound.io/github/jbuget/stacks-api)
[![bitHound Dependencies](https://www.bithound.io/github/jbuget/stacks-api/badges/dependencies.svg)](https://www.bithound.io/github/jbuget/stacks-api/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/jbuget/stacks-api/badges/devDependencies.svg)](https://www.bithound.io/github/jbuget/stacks-api/master/dependencies/npm)

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

Check that the application is up : in your browser access [http://localhost:3000/people](http://localhost:3000/people).

Or in a console :

```
$ curl -G 'http://localhost:3000/people'
```

### (optionnal) 4/ Setup Travis & Heroku CLI tools

- Install the [Travis CI CLI](https://github.com/travis-ci/travis.rb#installation)
- Install the [Heroku Toolbelt](https://toolbelt.heroku.com/)


## Anatomy of the application

```
app                     → Application sources
 └ controllers          → Controller classes defining routes, handlers and requests/responses schema validation
 └ models               → Model objects containing business and persistance intelligence
 └ db.js                → Database definition
 └ routes.js            → Routes definition
 └ server.js            → Hapi server definition
build                   → (unversionned) Generated sources or output
 └ coverage.html        → HTML report of Lab testing tool (tests status + code coverage + linting results)
config                  → Configurations files
 └ default.json         → Default configuration file
 └ {environment}.json   → Environment specific configuration file, based on NODE_ENV environment variable
 └ local.json           → (unversionned) Local configuration file
node_modules            → (unversionned) Downloaded Node dependencies
test                    → Source folder for unit or functional tests
.gitignore              → Git ignored files configuration
.travis.yml             → Travis CI configuration file
blueprint.apib          → API Blueprint specifications
package.json            → Node scripts & dependencies declaration
Procfile                → Heroku configuration file
README.md               → Project documentation
```


## Managing environments

We use [node-config](https://github.com/lorenwest/node-config) plugin to manage multi-environment runtime.

In particular, we manage environment specific configuration (DB, SMTP, variables, etc.) via [NODE_ENV environment variable](https://github.com/lorenwest/node-config/wiki/Environment-Variables#node_env).

If NODE_ENV variable is not defined, then ```config/default.json``` configuration file will be used.

If it is defined (known values are 'stage' or 'production'), then the corresponding environment configuration file (ex: ```config/stage.json```) will be used.

**Warning!** If a ```config/local.json``` file is defined, it will be used, even if the NODE_ENV variable is set, according to the [node-config file load order](https://github.com/lorenwest/node-config/wiki/Configuration-Files#file-load-order).


## Testing

Todo


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


## Release & deployment

Todo