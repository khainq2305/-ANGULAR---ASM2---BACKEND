const express = require("express");
const router = express.Router();
const CommentController = require("../../controllers/Client/commentController");
const { checkJWT } = require('../../middlewares/authMiddleware');
router.post("/", checkJWT, CommentController.create);
router.get("/product/:id", CommentController.getByProduct);

module.exports = router;
