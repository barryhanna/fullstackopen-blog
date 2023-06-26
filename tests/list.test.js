const listHelper = require('../utils/list_helper');
const testHelper = require('../utils/test_helper');

test('dummy returns one', () => {
	const blogs = [];
	const result = listHelper.dummy(blogs);
	expect(result).toBe(1);
});

describe('list helper', () => {
	test('total likes to be 0', () => {
		const noBlogs = [];
		const result = listHelper.totalLikes(noBlogs);
		expect(result).toBe(0);
	});

	test('total likes to be 36', () => {
		const result = listHelper.totalLikes(testHelper.initialBlogs);
		expect(result).toBe(36);
	});
});

describe('favourite blog', () => {
	test('favourite blog to equal likes with 12', () => {
		const result = listHelper.favouriteBlog(testHelper.initialBlogs);
		expect(result).toEqual({
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			likes: 12,
			url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		});
	});
});

describe('author with most blogs', () => {
	test('author with the most blogs to be Robert C. Martin with 3', () => {
		const result = listHelper.mostBlogs(testHelper.initialBlogs);
		expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 });
	});
});

describe('author with most likes in total', () => {
	test('author to be Edsger W. Dijkstra with 17 likes', () => {
		const result = listHelper.mostLikes(testHelper.initialBlogs);
		expect(result).toEqual({
			author: 'Edsger W. Dijkstra',
			likes: 17,
		});
	});
});
