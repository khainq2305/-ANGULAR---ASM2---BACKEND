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
      console.log("đã gọi getByProduct" ); // Debug log
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

  static async getCommentUser(req, res) { 
    console.log("đã gọi getCommentUser" ); // Debug log
    const { userId, productId } = req.query;

    if (!userId || !productId) {
        return res.status(400).json({ message: "Thiếu userId hoặc productId" });
    }

    try {
        // Thay 'userId' thành 'idUser' vì tên cột trong CSDL là 'idUser'
        const comment = await Comment.findOne({
            where: {
                idUser: userId,  // Chỉnh sửa ở đây
                product_id: productId
            }
        });

        if (comment) {
            return res.status(200).json({ exists: true, comment });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Lỗi getCommentUser:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
}

}

module.exports = CommentController;
