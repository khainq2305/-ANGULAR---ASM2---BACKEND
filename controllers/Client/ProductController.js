const { Op } = require('sequelize'); // ✅ Thêm dòng này
const Product = require('../../models/Client/ProductModel');

class ClientProductController {
  static async getById(req, res) {
    try {
      const id = req.params.id;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
  static async getAllActive(req, res) {
    try {
      const {
        categoryIds,
        page = 1,
        limit = 20,
        sort = 'desc'
      } = req.query;
  
      const where = { status: 1 };
  
      if (categoryIds) {
        const ids = categoryIds.split(',').map(id => parseInt(id, 10));
        where.idCategory = { [Op.in]: ids };
      }
  
      const offset = (parseInt(page) - 1) * parseInt(limit);
  
      const { rows: products, count: total } = await Product.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        order: [['price', sort === 'asc' ? 'ASC' : 'DESC']] // 👈 Sắp xếp theo giá
      });
  
      res.status(200).json({
        data: products,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error("🔥 Lỗi server:", error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
  
  
}

module.exports = ClientProductController;
