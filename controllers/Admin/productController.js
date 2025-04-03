const ProductModel = require('../../models/Admin/productModel');

class ProductController {
    static async get(req, res) {
        try {
            const products = await ProductModel.findAll();
            res.status(200).json({
                status: 200,
                message: "Lấy danh sách sản phẩm thành công",
                data: products
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ProductController;
