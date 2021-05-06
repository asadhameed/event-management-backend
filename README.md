# Project Description

Back-end API for event management. The API is developed in (Express, Nodejs and MongoDB). <br>
The API have different endpoints:

- User login/registration
- User can create and delete an event,
- User can filters(running, walking, swimming) the events.
- Hashing technique used to secure password.

<strong> The User Registration and Authentication API</strong> <br>
User registration/SingUp have some constraints e.g. valid Email, Password has min 6 and max 20 characters.

- post('/user/login');
- post('/user/registration');
- get('/user/:id');

<strong> Event API</strong> <br>
Login user have some constraints e.g. Event title has min 4 and max 30 characters, Price should greater then zero

- get('/events');
- get('/events/:eventType');
- post('/event');
- delete('/event/:id');

<strong> Event Register API</strong> <br>
User can subscribe to the event. When the user will subscribe the event admin can reject or accept that event.

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

### Open [Front-End Code](https://github.com/asadhameed/event-management-frontend)
