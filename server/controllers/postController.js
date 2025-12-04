const Post = require('../models/Post');


module.exports.createPost = async (req, res, next) => {
	try {
		const { title, content } = req.body;
		if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
		const post = await Post.create({ title, content, author: req.user._id });
		res.status(201).json(post);
	} catch (err) {
		next(err);
	}
};


module.exports.getAllPosts = async (req, res, next) => {
	try {
		const posts = await Post.find().populate('author', 'username email role').sort({ createdAt: -1 });
		res.json(posts);
	} catch (err) {
		next(err);
	}
};


module.exports.getSinglePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id).populate('author', 'username email role');
		if (!post) return res.status(404).json({ error: 'Post not found' });
		res.json(post);
	} catch (err) {
		next(err);
	}
};


module.exports.updatePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ error: 'Post not found' });
// allow owner or admin (owner check handled in middleware or here)
		if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
			return res.status(403).json({ error: 'Not authorized to update this post' });
		}
		post.title = req.body.title ?? post.title;
		post.content = req.body.content ?? post.content;
		await post.save();
		res.json(post);
	} catch (err) {
		next(err);
	}
};


module.exports.deletePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ error: 'Post not found' });
		if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
			return res.status(403).json({ error: 'Not authorized to delete this post' });
		}
		await post.remove();
		res.json({ msg: 'Post deleted' });
	} catch (err) {
		next(err);
	}
};