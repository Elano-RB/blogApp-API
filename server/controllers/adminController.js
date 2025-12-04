const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { errorHandler } = require('../auth');


exports.deleteAnyPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.deleteOne();
    res.json({ msg: 'Post removed by admin' });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.deleteAnyComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await comment.deleteOne();
    res.json({ msg: 'Comment removed by admin' });
  } catch (err) {
    errorHandler(err, req, res);
  }
};