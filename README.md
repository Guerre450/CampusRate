
# Campus Rate

## Description

REST API which allows student to consult places or services on the campus. 
Also, allows the students to rate these places.

## Fonctionalities :
- Register and update a place on the campus, with informations such as : description, category, address, services and status
- Register and update a rating of a place on the campus, with information such as : author, rating and comment
- Displays a single rating or place
- Displays a list of ratings of a places
- Displays all the places in page format with filtering options such as : category, page, and limit (places per page)

## Configurations :
### .env
Copy the .env.example and name it .env, fill the following info:
- PORT : number of the port to run the api on
- MONGO_PORT : The port mongodb is running on. 
- MONGO_DOMAIN : The domain of the mongodb
- MONGO_USERNAME : The user of the mongodb instance
- MONGO_PASSWORD : The password of the user of the mongodb instance
- MONGO_DB : The name of the Database in the mongodb instance
- MONGO_AUTHSOURCE : Source of the user's authentification database


### common:
- everything that is accessible globally should be under src/common

## Routes & Dtos:
### Conceptual Routes & Dtos

[Click here to navigate to initial concepts](https://github.com/Guerre450/TP1-CampusRate/tree/main/docs/initial_concepts)

## Known Limits
- Cannot GET the full list of ratings

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Run linting
### Lint and autofix with eslint
$ npm run lint

### Format with prettier
$ npm run format
