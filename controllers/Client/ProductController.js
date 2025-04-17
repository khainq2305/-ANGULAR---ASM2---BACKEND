const { Op } = require('sequelize'); // ✅ Thêm dòng này
const Product = require('../../models/Client/ProductModel');
const Category = require('../../models/Client/categoryModel'); // 👈 Đường dẫn đúng model của m

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
        search = '',
        page = 1,
        limit = 20,
        sort = 'desc'
      } = req.query;
  
      const where = { status: 1 };
  
      if (categoryIds) {
        const ids = categoryIds.split(',').map(id => parseInt(id, 10));
        where.idCategory = { [Op.in]: ids };
      }
  
      if (search.trim()) {
        where.name = { [Op.like]: `%${search}%` };
      }
  
      const offset = (parseInt(page) - 1) * parseInt(limit);
  
      const { rows: products, count: total } = await Product.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        order: [['price', sort === 'asc' ? 'ASC' : 'DESC']]
      });
  
      // ✅ Tính finalPrice thủ công
      const processedProducts = products.map(product => {
        product = product.toJSON();
        product.finalPrice = product.discount > 0
          ? product.price - product.discount
          : product.price;
        return product;
      });
  
      res.status(200).json({
        data: processedProducts,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error("🔥 Lỗi server:", error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
  
  
  static async getFeatured(req, res) {
    try {
      let featuredProducts = await Product.findAll({
        where: {
          status: 1,
          is_feature: 1
        },
        include: [
          {
            model: Category,
            as: 'category',
            where: { status: 1 },
            attributes: ['id', 'name']
          }
        ]
      });
  
      if (!featuredProducts || featuredProducts.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }
  
      // 🧠 Tính finalPrice thủ công
    featuredProducts = featuredProducts.map(product => {
      product = product.toJSON();
      product.finalPrice = product.discount > 0
        ? product.price - product.discount
        : product.price;
      return product;
    });
      res.json(featuredProducts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
  
  

  
}

module.exports = ClientProductController;
