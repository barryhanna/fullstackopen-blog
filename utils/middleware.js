const errorHandler = (error, request, response, next) => {
	console.error(error.message);

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

module.exports = {
	errorHandler,
	getTokenFrom,
};
