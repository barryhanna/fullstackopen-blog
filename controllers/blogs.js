const blogsRouter = require('express').Router();
const { response } = require('../app');
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body);
	if (!blog.likes) {
		blog.likes = 0;
	}
	if (!blog.title || !blog.url) {
		return response.status(400).json({
			error: 'Bad request: a title and url must both be provided.',
		});
	}
	const result = await blog.save();
	response.status(201).json(result);
});

blogsRouter.patch('/:id', async (request, response) => {
	const updateBlog = await Blog.findByIdAndUpdate(
		{
			_id: request.params.id,
		},
		{ ...request.body },
		{ returnDocument: 'after' }
	);
	response.status(200).json(updateBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndDelete(request.params.id);
	response.status(204).json({ message: 'Item deleted' });
});

module.exports = blogsRouter;
