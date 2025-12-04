const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { errorHandler } = require('../auth');


module.exports.addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Create the comment
    const comment = await Comment.create({ post: postId, author: req.user.id, content });

    // Add the comment to the post's comments array
    post.comments.push(comment._id);
    await post.save();

    // Fetch the post with all comments populated
    const updatedPost = await Post.findById(postId)
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username email' },
        options: { sort: { createdAt: -1 } }
      })
      .populate('author', 'username email');

    res.status(201).json(updatedPost);
  } catch (err) {
    errorHandler(err, req, res);
  }
};


module.exports.getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    errorHandler(err, req, res);
  }
};


module.exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    errorHandler(err, req, res);
  }
};