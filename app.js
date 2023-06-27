const config = require('./utils/config');
require('express-async-errors');
const express = require('express');
const app = express();
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const mongoose = require('mongoose');
const cors = require('cors');

const mongoUrl = `${config.MONGO_DB_URI}`;

console.log('Connecting to db...');
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);

module.exports = app;
