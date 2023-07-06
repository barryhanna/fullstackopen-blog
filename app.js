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
const { tokenExtractor } = require('./utils/middleware');

const mongoUrl = `${config.MONGO_DB_URI}`;

console.log('Connecting to db...');
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
	const testingRouter = require('./controllers/testing');
	app.use('/api/testing', testingRouter);
}

app.use(errorHandler);

module.exports = app;
