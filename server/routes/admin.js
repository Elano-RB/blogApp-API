const express = require("express");
const router = express.Router();
const adminController = require("../controllers/userController");
const { verify, verifyAdmin } = require("../auth");

// Admin-only endpoints
router.delete('/posts/:_id', verify, verifyAdmin, adminController.deleteAnyPost);
router.delete('/comments/_id', verify, verifyAdmin, adminController.deleteAnyComment);


module.exports = router;