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

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog,
};
