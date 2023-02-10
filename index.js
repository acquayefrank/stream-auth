'use strict'

const express = require('express');
const swaggerUI = require('swagger-ui-express');
const morgan = require("morgan");
const cors = require("cors");
var rfs = require('rotating-file-stream');
const path = require('path');

const docs = require('./docs');

const app = express();
// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
  })


// Middleware
app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(docs));
// log to console
app.use(morgan("dev"));
// log all requests to access.log
app.use(morgan('combined', { stream: accessLogStream }))
app.use(cors());


// Routes
app.get('/', (req, res) => {
    res.send('stream-auth!');
});
app.get('_health', (req, res) => {
    res.send('OK');
});

app.get('users', (req, res) => {
    res.send('OK');
});

app.get('users/:id', (req, res) => {});

app.post('users', (req, res) => {});

app.put('users/:id', (req, res) => {});

app.delete('users/:id', (req, res) => {});

 

// PORT
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`stream-auth listening on port ${port}!`);
});