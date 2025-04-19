const Cart = require("../../models/Client/CartModel");
const User = require('../../models/Client/UserModel'); // ✅ thêm dòng này để fix lỗi
const Product = require('../../models/Client/productModel'); // ✅ import model Product

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
  
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
  
      let existingCart = await Cart.findOne({
        where: { idUser, product_id }
      });
  
      if (existingCart) {
        // ✅ Kiểm tra nếu tổng vượt quá tồn kho
        if (existingCart.quantity + quantity > product.quantity) {
          return res.status(400).json({
            message: `Chỉ còn ${product.quantity - existingCart.quantity} sản phẩm có sẵn`
          });
        }
  
        existingCart.quantity += quantity;
        await existingCart.save();
  
        return res.status(200).json({ message: "Đã cập nhật số lượng", data: existingCart });
      } else {
        // ✅ Nếu thêm mới, cũng phải kiểm tra
        if (quantity > product.quantity) {
          return res.status(400).json({
            message: `Chỉ còn ${product.quantity} sản phẩm có sẵn`
          });
        }
  
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
      let items = await Cart.findAll({
        where: { idUser: id },
        include: [
          {
            model: Product,
            as: 'product',
            required: true,
            attributes: ['id', 'name', 'image', 'price', 'discount', 'quantity'] // ✅ thêm 'quantity'
          }
        ]
        
      });
      
  
      items = items.map(item => {
        const product = item.product?.toJSON?.() || {}; // ✅ không lỗi khi undefined
      
        const finalPrice = product.discount > 0
          ? product.price - product.discount
          : product.price;
      
        return {
          ...item.toJSON(),
          product: {
            ...product,
            finalPrice
          }
        };
      });
      
  
      res.json({ message: "Lấy giỏ hàng thành công", data: items });
    } catch (err) {
      console.error("❌ Lỗi lấy giỏ hàng:", err);
      res.status(500).json({ message: "Lỗi", error: err.message });
    }
  }
  // Xoá 1 sản phẩm trong giỏ
static async deleteOne(req, res) {
  const { id } = req.params;
  try {
    await Cart.destroy({ where: { id } });
    res.json({ message: 'Đã xoá sản phẩm khỏi giỏ hàng' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xoá sản phẩm', error: err.message });
  }
}

// Xoá nhiều sản phẩm
static async deleteMultiple(req, res) {
  const { ids } = req.body; // [1, 2, 3]
  try {
    await Cart.destroy({ where: { id: { [Op.in]: ids } } });
    res.json({ message: 'Đã xoá nhiều sản phẩm khỏi giỏ hàng' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xoá nhiều sản phẩm', error: err.message });
  }
}

      
}

module.exports = CartController;
