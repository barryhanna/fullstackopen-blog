const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user');
	response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
	const body = request.body;

	const decodedToken = jwt.verify(request.token, process.env.SECRET);

	if (!decodedToken.id) {
		return response.status(401).json({ error: 'token invalid' });
	}
	const user = await User.findById(decodedToken.id);

	const blog = new Blog({
		...body,
		user: {
			username: decodedToken.username,
			name: user.name,
			id: decodedToken.id,
		},
	});

	if (!blog.likes) {
		blog.likes = 0;
	}
	if (!blog.title || !blog.url) {
		return response.status(400).json({
			error: 'Bad request: a title and url must both be provided.',
		});
	}
	const result = await blog.save();
	if (blog.blogs) {
		blog.blogs = user.blogs.concat(result._id);
	}
	response.status(201).json(result);
});

blogsRouter.patch(
	'/:id',
	userExtractor,
	async (request, response) => {
		const token = request.token;

		const decodedToken = jwt.verify(token, process.env.SECRET);

		if (!decodedToken.id) {
			return response.status(401).json({ error: 'token invalid' });
		}

		const user = await User.findById(decodedToken.id);
		const updateBlog = await Blog.findByIdAndUpdate(
			{
				_id: request.params.id,
			},
			{
				...request.body,
				user: {
					id: decodedToken.id,
					username: decodedToken.username,
					name: user.name,
				},
			},
			{ returnDocument: 'after' }
		);
		response.status(200).json(updateBlog);
	}
);

blogsRouter.delete(
	'/:id',
	userExtractor,
	async (request, response) => {
		const token = request.token;

		if (!token) {
			return response.status(401).json({
				error: 'You must be logged in to complete this action',
			});
		}

		const blog = await Blog.findById(request.params.id);
		if (!blog) {
			return response.status(404).json({ message: 'No blog found' });
		}

		const decodedToken = jwt.verify(token, process.env.SECRET);

		if (blog.user.id.toString() === decodedToken.id) {
			await Blog.findByIdAndDelete(request.params.id);
			return response.status(204).json({ message: 'Item deleted' });
		} else {
			response.status(401).json({
				error:
					'Blogs can only be deleted by the user who created them',
			});
		}
	}
);

module.exports = blogsRouter;
