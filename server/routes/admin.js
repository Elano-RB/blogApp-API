const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verify, verifyAdmin } = require("../auth");

// Admin-only endpoints
router.delete('/posts/:id', verify, verifyAdmin, adminController.deleteAnyPost);
router.delete('/comments/:id', verify, verifyAdmin, adminController.deleteAnyComment);


module.exports = router;