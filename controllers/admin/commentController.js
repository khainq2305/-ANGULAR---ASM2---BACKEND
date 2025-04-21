const { Sequelize } = require('sequelize');
const Comment = require('../../models/Admin/commentModel');
const Product = require('../../models/Admin/productModel'); 
const User = require('../../models/Admin/userModel'); 
require('dotenv').config(); 
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'; 

Comment.belongsTo(Product, { foreignKey: 'product_id' });
Comment.belongsTo(User, { foreignKey: 'idUser' }); 

module.exports = {
  async list(req, res) {
    const { product_id } = req.query;
    const where = product_id ? { product_id } : {};

    const comments = await Comment.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: comments });
  },

  async create(req, res) {
    try {
      console.log('👉 req.body:', req.body); // Kiểm tra dữ liệu gửi lên
  
      const { idUser, content, product_id, rating } = req.body;
  
      // Kiểm tra dữ liệu trước khi lưu
      if (!idUser || !product_id) {
        return res.status(400).json({
          success: false,
          message: 'idUser và product_id là bắt buộc!',
        });
      }
  
      // Tạo bình luận
      const comment = await Comment.create({
        idUser,
        product_id,
        content,
        rating
      });
  
      return res.json({ success: true, message: 'Thêm bình luận thành công', data: comment });
    } catch (err) {
      console.error('❌ Lỗi tạo bình luận:', err);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
  
  ,
  async update(req, res) { 
    try {
      const { id } = req.params;
      const { content, rating } = req.body;
  
      // Tìm bình luận theo ID
      const comment = await Comment.findByPk(id);
      if (!comment) return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });
  
      // Lưu trạng thái "đã chỉnh sửa"
      let updated = false;
  
      // Cập nhật nội dung và đánh giá nếu có sự thay đổi
      if (content && content !== comment.content) {
        comment.content = content;
        updated = true;
      }
  
      if (rating && rating !== comment.rating) {
        comment.rating = rating;
        updated = true;
      }
  
      if (updated) {
        comment.updatedAt = new Date(); // Cập nhật thời gian chỉnh sửa
      }
  
      await comment.save();
  
      return res.json({ success: true, message: 'Cập nhật bình luận thành công', data: comment  });
    } catch (error) {
      console.error('❌ Lỗi cập nhật bình luận:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },
  

  async delete(req, res) {
    console.log("Đã gọi hàm xóa bình luận admin"); // Debug log
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });

    await comment.destroy();
    res.json({ success: true, message: 'Xóa bình luận thành công' });
  },

  async markSpam(req, res) {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });

    comment.is_spam = true;
    await comment.save();

    res.json({ success: true, message: 'Đã đánh dấu spam' });
  },

  async getCommentSummary(req, res) {
    try {
      const summaries = await Comment.findAll({
        attributes: [
          'product_id',
          [Sequelize.fn('COUNT', Sequelize.col('Comment.idComment')), 'totalComments'],
          [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating']
        ],
        include: [{
          model: Product,
          attributes: ['name', 'image']
        }],
        group: ['product_id', 'Product.id'],
        order: [['product_id', 'ASC']]
      });
  
      const result = summaries.map(item => ({
        productId: item.product_id,
        productName: item.Product?.name || 'Không rõ',
        imageUrl: item.Product?.image ? `${BASE_URL}/uploads/${item.Product.image}` : '',
        totalComments: parseInt(item.getDataValue('totalComments')),
        avgRating: parseFloat(item.getDataValue('avgRating'))

      }));
  
      res.json({ success: true, data: result });
    } catch (err) {
      console.error('Lỗi khi lấy tổng bình luận:', err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },
  async getCommentByProduct(req, res) {
    try {
      console.log("Đã gọi hàm getCommentByProduct admin");
  
      const { id } = req.params;
      const { page = 1, limit = 5 } = req.query; // Default page is 1, limit is 10
  
      // Find product by ID
      const product = await Product.findByPk(id, {
        attributes: ['name']
      });
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại'
        });
      }
  
      // Get all comments for the product with pagination
      const offset = (page - 1) * limit;
      const comments = await Comment.findAll({
        where: { product_id: id },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'avatar'],
            required: true
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10)
      });
  
      if (comments.length === 0) {
        return res.json({
          success: true,
          productName: product.name,
          comments: [],
          message: 'Không có bình luận cho sản phẩm này'
        });
      }
  
      const result = comments.map(comment => ({
        id: comment.idComment,
        idUser: comment.idUser,
        user: comment.User?.name || 'Không rõ',
        avatar: comment.User?.avatar ? `${BASE_URL}${comment.User.avatar}` : `${BASE_URL}/uploads/avatar-default.jpg`,
        rating: comment.rating,
        content: comment.content,
        createdAt: comment.createdAt.toISOString().split('T')[0], 
        updatedAt: comment.updatedAt ? comment.updatedAt.toISOString().split('T')[0] : null,
        reply: comment.reply || null,
        replyDate: comment.replyDate ? comment.replyDate.toISOString().split('T')[0] : null
      }));
  
      // Get total count of comments for pagination information
      const totalComments = await Comment.count({ where: { product_id: id } });
  
      res.json({
        success: true,
        productName: product.name,
        comments: result,
        totalComments,
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit)
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
  
  
  
};
