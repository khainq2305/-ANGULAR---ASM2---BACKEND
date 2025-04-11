const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/admin/commentController');

router.get('/', commentController.list);
router.post('/', commentController.create);
router.delete('/:id', commentController.delete);
router.patch('/:id/spam', commentController.markSpam); 
router.get('/summary', commentController.getCommentSummary);
router.get('/product/:id', commentController.getCommentByProduct);
module.exports = router;
