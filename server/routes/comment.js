const express = require("express");
const router = express.Router();
const commentController = require("../controllers/userController");
const { verify } = require("../auth");

// view comments in a post (public)
router.get('/get-comment/:postId', commentController.getCommentsByPost);


// add comment
router.post('/add-comment', verify, commentController.addComment);


// delete comment (author or admin)
router.delete('/delete-comment/:id', verify, commentController.deleteComment);


module.exports = router;