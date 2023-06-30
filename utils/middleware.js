const jwt = require('jsonwebtoken');

const errorHandler = (error, request, response, next) => {
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	} else if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({
			error: 'invalid token',
		});
	} else if (error.name === 'TokenExpiredError') {
		return response.status(401).json({
			error: 'token expired',
		});
	}

	next(error);
};

const getTokenFrom = (request) => {
	const authorization = request.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '');
	}
	return null;
};

const tokenExtractor = (request, response, next) => {
	request.token = getTokenFrom(request);
	next();
};

const userExtractor = async (request, response, next) => {
	request.token = getTokenFrom(request);
	request.user = await jwt.verify(request.token, process.env.SECRET);
	next();
};

module.exports = {
	errorHandler,
	tokenExtractor,
	userExtractor,
};
