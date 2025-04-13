const Cart = require("../../models/Client/CartModel");
const User = require('../../models/Client/UserModel'); // ✅ thêm dòng này để fix lỗi
const Product = require('../../models/Client/ProductModel'); // ✅ import model Product

class CartController {
  static async addToCart(req, res) {
    try {
      const { product_id, quantity } = req.body;
      const idUser = req.user.id;
  
      if (!idUser || !product_id || !quantity) {
        return res.status(400).json({ message: 'Thiếu thông tin' });
      }
  
      const user = await User.findByPk(idUser);
      if (!user) {
        return res.status(400).json({ message: 'Người dùng không tồn tại!' });
      }
  
      // ✅ Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
      let existingCart = await Cart.findOne({
        where: { idUser, product_id }
      });
  
      if (existingCart) {
        // ✅ Nếu đã có → cập nhật số lượng
        existingCart.quantity += quantity;
        await existingCart.save();
  
        return res.status(200).json({ message: "Đã cập nhật số lượng", data: existingCart });
      } else {
        // ✅ Nếu chưa có → tạo mới
        const newCart = await Cart.create({
          idUser,
          product_id,
          quantity
        });
  
        return res.status(201).json({ message: 'Thêm vào giỏ hàng thành công', data: newCart });
      }
    } catch (error) {
      console.error('❌ Lỗi thêm vào giỏ hàng:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
  
     
      static async getCartByUser(req, res) {
        const { id } = req.params;
        try {
          const items = await Cart.findAll({
            where: { idUser: id },
            include: [
              {
                model: Product,
                as: 'product', // 👈 nếu bạn định nghĩa alias khi `Cart.belongsTo(Product, { ... })`
                attributes: ['id', 'name', 'image', 'price', 'discount', 'finalPrice']
              }
            ]
          });
          console.log("📦 Cart items (backend):", items);

          res.json({ message: "Lấy giỏ hàng thành công", data: items });
        } catch (err) {
          console.error("❌ Lỗi lấy giỏ hàng:", err);
          res.status(500).json({ message: "Lỗi", error: err.message });
        }
      }
      
}

module.exports = CartController;
