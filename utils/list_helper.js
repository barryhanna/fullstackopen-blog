const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((total, blog) => (total += blog.likes), 0);
};

const favouriteBlog = (blogs) => {
	let favouriteBlog = blogs[0];
	blogs.forEach((blog) => {
		if (blog.likes > favouriteBlog.likes) {
			favouriteBlog = blog;
		}
	});
	return favouriteBlog;
};

const mostBlogs = (blogs) => {
	let mostBlogs = {};

	blogs.forEach((blog) => {
		if (!mostBlogs[blog.author]) {
			mostBlogs[blog.author] = 1;
		} else {
			mostBlogs[blog.author] += 1;
		}
	});
	const mostProlificAuthor = Object.entries(mostBlogs).sort(
		(a, b) => b[1] - a[1]
	)[0];
	return {
		author: mostProlificAuthor[0],
		blogs: mostProlificAuthor[1],
	};
};

const mostLikes = (blogs) => {
	const authorLikes = blogs.reduce(function (total, blog) {
		if (total[blog.author]) {
			total[blog.author] += blog.likes;
		} else {
			total[blog.author] = blog.likes;
		}
		return total;
	}, {});
	const [author, likes] = Object.entries(authorLikes).sort(
		(a, b) => b[1] - a[1]
	)[0];
	return { author, likes };
};

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog,
	mostBlogs,
	mostLikes,
};
