const Comment = require('../models/Comment');
const Post = require('../models/Post');


module.exports.addComment = async (req, res, next) => {
	try {
		const { postId, content } = req.body;
		if (!postId || !content) return res.status(400).json({ error: 'postId and content required' });
		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ error: 'Post not found' });
		const comment = await Comment.create({ post: postId, author: req.user._id, content });
		res.status(201).json(comment);
	} catch (err) {
		next(err);
	}
};


module.exports.getCommentsByPost = async (req, res, next) => {
	try {
		const postId = req.params.postId;
		const comments = await Comment.find({ post: postId }).populate('author', 'username email').sort({ createdAt: -1 });
		res.json(comments);
	} catch (err) {
		next(err);
	}
};


module.exports.deleteComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.id);
		if (!comment) return res.status(404).json({ error: 'Comment not found' });
// only author or admin can delete
		if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
			return res.status(403).json({ error: 'Not authorized to delete this comment' });
		}
		await comment.remove();
		res.json({ msg: 'Comment deleted' });
	} catch (err) {
		next(err);
	}
};