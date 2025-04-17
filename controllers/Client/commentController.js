const Comment = require("../../models/Admin/commentModel");

class CommentController {
  // POST /comments
  static async create(req, res) {
    try {
      const { product_id, rating, content } = req.body;
      const idUser = req.user?.id;
  
      console.log('📦 req.body:', req.body); // debug
      console.log('👤 req.user:', req.user); // debug
  
      if (!product_id || !rating || !idUser) {
        return res.status(400).json({ message: "Thiếu thông tin đánh giá" });
      }
  
      const newComment = await Comment.create({
        idUser,
        product_id,
        rating,
        content
      });
  
      res.status(201).json({ message: "Đánh giá thành công", data: newComment });
    } catch (error) {
      console.error("🔥 Lỗi đánh giá:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
  
  // GET /comments/product/:id
  static async getByProduct(req, res) {
    try {
      const { id } = req.params;

      const comments = await Comment.findAll({
        where: { product_id: id },
        order: [['createdAt', 'DESC']]
      });

      res.json({ success: true, data: comments });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
  }
}

module.exports = CommentController;
