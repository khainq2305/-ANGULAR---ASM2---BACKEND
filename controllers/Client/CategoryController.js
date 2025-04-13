const Category = require('../../models/Admin/categoryModel');

class CategoryController {
  static async getAll(req, res) {
    try {
      const categories = await Category.findAll({
        where: { status: true } 
      });

      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
}

module.exports = CategoryController;
