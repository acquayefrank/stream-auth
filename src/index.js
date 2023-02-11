'use strict';

const express = require('express');
const swaggerUI = require('swagger-ui-express');
const morgan = require("morgan");
const cors = require("cors");
const rfs = require('rotating-file-stream');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const docs = require('./docs');

const app = express();
// // create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
  })


// Middleware
app.use('/docs', swaggerUI.serve, swaggerUI.setup(docs));
// log to console
app.use(morgan("dev"));
// log all requests to access.log
app.use(morgan('combined', { stream: accessLogStream }))
app.use(cors());
app.use(bodyParser.json());

 
// Import routes
const usersRoute = require('./routes/users');

// Route Middlewares
app.use('/users', usersRoute);


app.get('/', (req, res) => {
    res.send('stream-auth!');
});

app.get('_health', (req, res) => {
    res.send('OK');
});

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true ,
        useCreateIndex: true,
        strictQuery: false
    },
    () => console.log('connected to DB!')
);

// PORT
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`stream-auth listening on port ${port}!`);
});