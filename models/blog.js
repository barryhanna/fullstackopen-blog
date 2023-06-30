const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number,
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
		},
		name: String,
		username: String,
	},
	blogs: [String],
});

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
