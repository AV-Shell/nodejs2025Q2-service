# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/AV-Shell/nodejs2025Q2-service.git
```

## Change branch to develop

```
git checkout dev-part2
```

## Create .env file from .env.example

```
copy .env.example .env
```

## Installing NPM modules

```
npm install
```

# !!! ATTENTION !!!
### For tracking to work, you need a Docker Compose version greater than 2.20. I had 2.40. 

### You can check this with the command

```
docker compose version
```

# Since the 500 megabyte requirement hasn't changed for three years, and during that time, dependencies and base images size have increased, I consider this requirement invalid. However, since it exists, a special image has been created for it.

# Also watch works only in dev compose versions. You need write --watch flag when you run compose

## Running application in docker: 

 1) Download and install [Docker](https://docs.docker.com/engine/install/)

 2) Run in terminal next command : 



```
docker compose up --watch
```

## Stop app in docker:

 1) Run in terminal next command : 

```
docker compose down
```


# There are also two normal images for dev and production development.
# Prod.  

 2) Run in terminal next command : 

```
docker compose -f docker-compose.prod.yaml up
```

## Stop app in docker:

 1) Run in terminal next command : 

```
docker compose -f docker-compose.prod.yaml down
```
# Dev 

 2) Run in terminal next command : 

```
docker compose -f docker-compose.dev.yaml up --watch
```

## Stop app in docker:

 1) Run in terminal next command : 

```
docker compose -f docker-compose.dev.yaml down
```


## Scan docker images

 1) Run in terminal next command : 

```
npm run docker:scan
```


After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

Before starting test you need install npm packages

open new terminal and enter:

```
npm install
```

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
