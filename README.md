# Crypto Tracker Graphql Gateway

## Description

This project has been bootstrapped with [Nest](https://github.com/nestjs/nest) framework. It act as the main communication aggregator between clients and backend services for Crypto Tracker

## Configuration

Make sure you have a valid [SendinBlue](https://my.sendinblue.com) API Key

Then create .env file in the root and write the environment variable for the project as follows:

```
SENDINBLUE_APIKEY
IDENTITY_SERVICE_URL
USER_SERVICE_URL
WEB_BASEURL
DISCORD_CLIENT
DISCORD_SECRET
DISCORD_CALLBACK
```

## Installation

```bash
$ npm install
```

## Running the app

Project will be running at http://localhost:4000. Make call to `/graphql` path to acccess graphql server for this project

```bash
# development
$ npm start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

using docker

```bash
# build the container
$ docker build . -t crypto-tracker-gateway

# run the container
$ docker run -d -p 4000:4000 crypto-tracker-gateway
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Please reach out to the engineering team if you faced any trouble running this project in your local.

## License

Nest is [MIT licensed](LICENSE).
