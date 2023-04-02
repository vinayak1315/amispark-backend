const express = require('express');
const errorMiddleware = require('./middlewares/errors')
const app = express();
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
require('dotenv').config();
app.use(express.json());

// Database connection
require('./database/database')

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

// Import all routes
const user = require('./route/userRegistration')
const event = require('./route/events')

// Routing 
app.use(user);
app.use(event);

app.listen(process.env.port, () => {
    console.log(`Server started on PORT: ${process.env.port}`)
}); 

// Middleware to handle errors
app.use(errorMiddleware)

module.exports = app;