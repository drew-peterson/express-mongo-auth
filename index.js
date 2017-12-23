// main starting point of the app -- 
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth'); // auth/auth is name of mogodb

// App setup
// express middleware -- incomming request is passed into
app.use(morgan('combined')); // logs to node -- debugger
app.use(bodyParser.json({ type: '*/*'})); // parser incomming requests into json no matter what.
router(app);   

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);

// 'nodemon' in console to run nodemon
console.log('Service linstening on: ', port);
