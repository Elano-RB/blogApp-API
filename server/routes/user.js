const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verify, verifyAdmin } = require("../auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/details", verify, userController.getUserDetails);
router.patch('/:id/set-as-admin', verify, verifyAdmin, userController.updateAdmin);
router.patch("/update-password", verify, userController.updatePassword);

module.exports = router;
