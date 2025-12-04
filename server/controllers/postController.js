const Post = require('../models/Post');
const auth = require("../auth");
const { errorHandler } = require("../auth.js");

module.exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const existingPost = await Post.findOne({ title: title });

    if (existingPost) {
      return res.status(409).send({
        success: false,
        message: "Post already exists",
      });
    }

    const newPost = await Post.create({
      title,
      content,
      author: req.user.id,
    })

    res.status(201).send({
      success: true,
      message: "Post created successfully",
      result: newPost,
    })


  } catch (error) {
    errorHandler(error, req, res);
  }
};


module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "email role")
            .sort({ createdAt: -1 });

        return res.status(200).json(posts);
    } catch (err) {
        return errorHandler(err, req, res);
    }
};



module.exports.getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "username email role");

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json(post);
    } catch (err) {
        return errorHandler(err, req, res);
    }
};



module.exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ error: "Not authorized to update this post" });
        }

        post.title = req.body.title ?? post.title;
        post.content = req.body.content ?? post.content;

        await post.save();

        return res.status(200).json(post);
    } catch (err) {
        return errorHandler(err, req, res);
    }
};



module.exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ error: "Not authorized to delete this post" });
        }

        await post.deleteOne();

        return res.status(200).json({ message: "Post deleted" });
    } catch (err) {
        return errorHandler(err, req, res);
    }
};
