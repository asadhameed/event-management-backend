# Project Description

This is the back-end API for event management. The API is developed in (Express and Nodejs). MongoDB is used as a database.

<strong> User end Point </strong>

- post('/user/login');
- post('/user/registration');
- get('/user/:id');

<strong> Event end point</strong>

- get('/events');
- get('/events/:eventType');
- post('/event');
- delete('/event/:id');

<strong> Event Register End point </strong>

- post('/eventRegister/:id');
- get('/eventRegister/:id');
- post('/eventRegister/approved/:id');
- post('/eventRegister/rejected/:id')
- get('/eventsRegister’)
- get('/eventsSubscribed')

## Environment Variables

First, create a .env file in the project directory. Gives your own value for the fellowing variables

- MONGO_DB_CONNECTION="mongodb://localhost/your_database"
- JWT_PRIVATE_KEY="Define_your_key"

Open the .env.test file in the project directory and change the MONGO_DB_CONNECTION variable

- MONGO_DB_CONNECTION="mongodb://localhost/your_test_database"

## Available Scripts

In the project directory, you can run:

### `npm i`

This command will install all the dependency packages in the node_modules directory.

### `npm run dev`

Runs the app in the development mode with nodemon.<br />
Call the API with [http://localhost:8000](http://localhost:8000).

### `npm start`

Runs the app in the production mode.<br />
Call the API with [http://localhost:8000](http://localhost:8000).

### `npm test`

Runs the test and shows the test result. The result shows how many Test suites, how many tests are passed and how many tests are failed.<br />
