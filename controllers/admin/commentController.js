const { Sequelize } = require('sequelize');
const Comment = require('../../models/admin/commentModel');
const Product = require('../../models/admin/productModel'); 
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
      const { idUser, content, product_id, rating, parent_id } = req.body;
      const comment = await Comment.create({
        idUser,
        content,
        product_id,
        rating,
        parent_id: parent_id || null
      });

      res.json({ success: true, message: 'Thêm bình luận thành công', data: comment });
    } catch (err) {
      console.error('❌ Lỗi tạo bình luận:', err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  async delete(req, res) {
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
        avgRating: parseFloat(item.getDataValue('avgRating')).toFixed(1)
      }));
  
      res.json({ success: true, data: result });
    } catch (err) {
      console.error('Lỗi khi lấy tổng bình luận:', err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },
  async getCommentByProduct(req, res) {
    try {
      const { id } = req.params;
  
      const comments = await Comment.findAll({
        where: { product_id: id },
        include: [
          {
            model: User,
            attributes: ['name', 'avatar']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      const product = await Product.findByPk(id, {
        attributes: ['name']
      });
  
      const result = comments.map(comment => ({ 
        id: comment.idComment,
        user: comment.User?.name || 'Không rõ',
        avatar: comment.User?.avatar ? `${BASE_URL}${comment.User.avatar}` : `${BASE_URL}/uploads/avatar-default.jpg`,
        rating: comment.rating,
        content: comment.content,
        date: comment.createdAt.toISOString().split('T')[0],
        reply: null,
        replyDate: null
      }));
  
      res.json({
        success: true,
        productName: product?.name || 'Không rõ sản phẩm',
        comments: result
      });
  
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
  
};
