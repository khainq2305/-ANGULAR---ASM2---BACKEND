require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../../models/Admin/userModel'); 
const upload = require('../../middlewares/upload');
module.exports = {
async list(req, res) {
    try {
      const { search, status, role } = req.query;
  
      let whereCondition = {};
  
      if (search) {
        whereCondition[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
      }
  
      if (status !== undefined) {
        whereCondition.status = parseInt(status);
      }
  
      if (role && role !== 'all') {
        whereCondition.role = role;
      }
  
      const users = await User.findAll({
        where: whereCondition,
      });
  
      res.json({
        success: true,
        data: users,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },
  

  async postAdd(req, res) {
    try {
      const { name, email, password, role, status, gender, phone, dob } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email đã tồn tại!' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const avatar = req.file ? `/uploads/${req.file.filename}` : null;


      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        gender,
        phone,
        status: parseInt(status),
        dob,
        avatar
      });

      res.json({
        success: true,
        message: 'Thêm người dùng thành công',
        data: newUser
      });
    } catch (err) {
      console.error("❌ Lỗi khi thêm user:", err.message, err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  async postEdit(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, role, status } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }

      const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

      await user.update({
        name,
        email,
        password: hashedPassword,
        role,
        status: parseInt(status),
      });

      res.json({ success: true, message: 'Cập nhật thành công', data: user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }

      await user.destroy({ force: true });

      res.json({ success: true, message: 'Tài khoản đã bị đánh dấu xóa' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; 
  
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }
  
      if (status !== undefined) {
        user.status = parseInt(status);
      } else {
        user.status = user.status === 1 ? 0 : 1;
      }
  
      await user.save();
      res.json({ success: true, message: 'Cập nhật trạng thái thành công', data: user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },
  
  async resetPassword(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }

      const newPassword = '12345678'; // mật khẩu mới mặc định hoặc random nếu muốn
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await user.save();

      res.json({ success: true, message: 'Đã cấp lại mật khẩu', password: newPassword });
    } catch (err) {
      console.error('Lỗi reset mật khẩu:', err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
};
