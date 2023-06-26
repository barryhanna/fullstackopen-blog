const supertest = require('supertest');
const helper = require('../utils/test_helper');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);

mongoose.set('bufferTimeoutMS', 30000);

const Blog = require('../models/blog');

beforeEach(async () => {
	await Blog.deleteMany({});

	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog);
		await blogObject.save();
	}
}, 100000);

describe('blog tests', () => {
	test('correct amount of blog posts return in JSON format', async () => {
		const initialNumberOfBlogs = helper.initialBlogs.length;
		const result = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
		expect(result.body.length).toEqual(initialNumberOfBlogs);
	}, 100000);

	test('unique identifier property of the blog posts is named id', async () => {
		const result = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
		expect(result.body[0].id).toBeDefined();
	});
});

describe('creating new blogs', () => {
	test('an HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
		const newBlog = {
			title: 'New Blog - Post Test',
			author: 'Test Author',
			url: 'http://newblog.com',
			likes: 12,
		};
		const result = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201);

		expect(result.body).toEqual({
			...newBlog,
			id: result.body.id,
		});
	});
	test('missing likes will default to 0', async () => {
		const newBlog = {
			title: 'New Blog - Test Missing Likes Results in likes being 0',
			author: 'Test Author',
			url: 'http://newblog.com',
		};
		const result = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201);

		expect(result.body.likes).toBe(0);
	});

	test('title or url properties are missing from the request data, return 400 bad request', async () => {
		const newBlog = {
			author: 'Test Author',
		};
		await api.post('/api/blogs').send(newBlog).expect(400);
	});
});

describe('deleting blogs', () => {
	test('delete a blog post and get a 204 response status code', async () => {
		const newBlog = {
			title: 'New blog to test delete',
			author: 'Test Author',
			url: 'http://newblog.com',
			likes: 100,
		};
		const result = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201);
		await api.delete(`/api/blogs/${result.body.id}`).expect(204);
	}, 100000);
});

describe('updating blogs', () => {
	test('update likes by 1 to be 2', async () => {
		const newBlog = {
			title: 'New blog to test likes increment',
			author: 'Test Author',
			url: 'http://newblog.com',
			likes: 1,
		};
		const blogToUpdate = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201);
		const result = await api
			.patch(`/api/blogs/${blogToUpdate.body.id}`)
			.send({
				...newBlog,
				likes: newBlog.likes + 1,
			})
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(result.body.likes).toBe(2);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
