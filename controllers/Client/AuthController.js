const User = require('../../models/Client/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // Đảm bảo có biến môi trường này

class AuthController {
    // Đăng ký người dùng
    static async register(req, res) {
        try {
            const { email, password } = req.body;
            console.log(req.body); // ✅ log ra xem nhận được gì từ frontend
            // Kiểm tra xem email đã tồn tại chưa
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email đã tồn tại!' });
            }

         

            const user = await User.create({
                email,
                password // ✅ Gửi raw password, model sẽ tự mã hóa
              });

            res.status(201).json({
                message: "Đăng ký thành công!",
                user: { id: user.id, email: user.email }
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }

    // Đăng nhập người dùng
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log("📩 Dữ liệu đăng nhập:", req.body); // 👈 THÊM DÒNG NÀY
            // Kiểm tra xem email có tồn tại không
            const user = await User.findOne({ where: { email } });
            console.log("🔍 User tìm thấy:", user);
            
            if (!user) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
            }

            // Kiểm tra mật khẩu với giá trị đã được mã hóa
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
            }

            // Tạo JWT token
            const token = jwt.sign(
                { id: user.id, name: user.name, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: "1h" } // Token hết hạn sau 1 giờ
            );

            res.status(200).json({
                message: "Đăng nhập thành công!",
                token,
                email: user.email,
                role: user.role // 👈 thêm dòng này
              });
              
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
}

module.exports = AuthController;
