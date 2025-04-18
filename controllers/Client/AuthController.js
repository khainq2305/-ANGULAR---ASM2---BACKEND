const User = require("../../models/Client/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
  static async register(req, res) {
    try {
      const { email, password } = req.body;
      console.log(req.body);

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã tồn tại!" });
      }

      const user = await User.create({
        email,
        password,
      });

      res.status(201).json({
        message: "Đăng ký thành công!",
        user: { id: user.id, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log("📩 Dữ liệu đăng nhập:", req.body);

      const user = await User.findOne({ where: { email } });
      console.log("🔍 User tìm thấy:", user);

      if (!user) {
        return res
          .status(400)
          .json({ message: "Email hoặc mật khẩu không chính xác!" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Email hoặc mật khẩu không chính xác!" });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Đăng nhập thành công!",
        token,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
}

module.exports = AuthController;
