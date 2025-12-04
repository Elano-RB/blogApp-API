const express = require("express");
const router = express.Router();
const postController = require("../controllers/userController");
const { verify } = require("../auth");


// Public
router.get('/all', postController.getAllPosts);
router.get('/getSingle/:id', postController.getSinglePost);


// Protected (create, update, delete)
router.post('/create', verify, postController.createPost);
router.put('/update/:id', verify, postController.updatePost);
router.delete('/delete-post/:id', verify, postController.deletePost);