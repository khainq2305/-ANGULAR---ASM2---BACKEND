const Cart = require('../../models/Client/CartModel');
const Order = require('../../models/Client/OrderModel');
const OrderDetail = require('../../models/Client/OrderDetailModel');
const Product = require('../../models/Admin/productModel');

class OrderController {
  // ✅ POST /orders/create
  static async createOrder(req, res) {
    try {
      const { idUser } = req.user;

      const {
        checkout_address_id,
        name,
        phone,
        payment_method,
        shipping_method,
        total_price
      } = req.body;

      // 1. Tạo đơn hàng mới
      const newOrder = await Order.create({
        idUser,
        checkout_address_id,
        name,
        phone,
        payment_method,
        shipping_method,
        total_price,
        status: 0, // Chờ xác nhận
        payment_status: 'pending'
      });

      // 2. Lấy danh sách sản phẩm trong giỏ hàng
      const cartItems = await Cart.findAll({
        where: { idUser },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'finalPrice']
          }
        ]
      });

      // Nếu không có sản phẩm => báo lỗi
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Giỏ hàng trống, không thể đặt hàng.' });
      }

      // 3. Tạo chi tiết đơn hàng từ từng mục trong giỏ
      for (const item of cartItems) {
        await OrderDetail.create({
          idOrder: newOrder.id,
          idProduct: item.product_id,
          quantity: item.quantity,
          price: item.product.finalPrice
        });
      }

      // 4. Xóa giỏ hàng của người dùng sau khi đặt hàng
      await Cart.destroy({ where: { idUser } });

      // 5. Trả về kết quả
      res.status(201).json({
        message: 'Đặt hàng thành công!',
        orderId: newOrder.id
      });
    } catch (error) {
      console.error('❌ Lỗi khi tạo đơn hàng:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
  static async getOrdersByUser(req, res) {
    try {
      const idUser = req.user.id;
  
      const orders = await Order.findAll({
        where: { idUser },
        include: [
          {
            model: OrderDetail,
            as: 'orderDetails',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['name', 'image', 'finalPrice']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      res.json({ success: true, orders });
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
      res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }
  
}

module.exports = OrderController;
