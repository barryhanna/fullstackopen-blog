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
		console.log('RESULT', result);
		expect(result.body[0].id).toBeDefined();
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
