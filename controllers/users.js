const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body;

	if (!username || !name || !password) {
		return response.status(400).json({
			error:
				'Must supply a username, name and password to create a new user',
		});
	}

	if (password.length < 3) {
		return response.status(400).json({
			error: 'Password must be 3 characters or more',
		});
	}

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		username,
		name,
		passwordHash,
	});

	const savedUser = await user.save();

	response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
	const users = await User.find({});
	response.json(users);
});

module.exports = usersRouter;
