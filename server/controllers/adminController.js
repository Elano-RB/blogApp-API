const Comment = require('../models/Comment');
const Post = require('../models/Post');


exports.deleteAnyPost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ error: 'Post not found' });
		await post.remove();
		res.json({ msg: 'Post removed by admin' });
	} catch (err) {
		next(err);
	}
};


exports.deleteAnyComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.id);
		if (!comment) return res.status(404).json({ error: 'Comment not found' });
		await comment.remove();
		res.json({ msg: 'Comment removed by admin' });
	} catch (err) {
		next(err);
	}
};