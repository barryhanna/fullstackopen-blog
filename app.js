const config = require('./utils/config');
require('express-async-errors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const { errorHandler } = require('./utils/middleware');

const mongoUrl = `${config.MONGO_DB_URI}`;

console.log('Connecting to db...');
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);
app.use(errorHandler);

module.exports = app;
