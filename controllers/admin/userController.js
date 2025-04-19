require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../../models/Admin/userModel'); 
const upload = require('../../middlewares/uploads');


module.exports = {
  async list(req, res) {
    try {
      const { search, status, role, gender, page = 1, limit = 10 } = req.query;
  
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereCondition = {};
  
      if (search) {
        whereCondition[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
      }
  
      if (status !== undefined && status !== '') {
        whereCondition.status = parseInt(status);
      }
  
      if (role && role !== 'all') {
        whereCondition.role = role;
      }
  
      if (typeof gender === 'string' && gender !== '') {
        whereCondition.gender = gender;
      }
  
      const { rows: users, count: total } = await User.findAndCountAll({
        where: whereCondition,
        offset,
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']],
      });
  
      res.json({
        success: true,
        data: users,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error('❌ Lỗi lấy danh sách người dùng:', err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },
  
  
  

  async postAdd(req, res) {
    try {
      const { name, email, password, role, status, gender, phone, dob } = req.body;
  
      const errors = {};
      if (!name) errors.name = 'Họ tên không được bỏ trống';
      if (!email) errors.email = 'Email không được bỏ trống';
      if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Email không hợp lệ';
      if (!password || password.length < 6) errors.password = 'Mật khẩu phải từ 6 ký tự';
      if (!phone || !/^[0-9]{10,12}$/.test(phone)) errors.phone = 'Số điện thoại không hợp lệ';
      if (!gender) errors.gender = 'Giới tính là bắt buộc';
      if (!dob) errors.dob = 'Ngày sinh không được bỏ trống';
  
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        errors.email = 'Email đã tồn tại';
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
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
        status: parseInt(status) || 1,
        dob,
        avatar
      });
  
      res.json({ success: true, message: 'Thêm người dùng thành công', data: newUser });
  
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
      const currentUserId = req.user?.id; // lấy ID người đang đăng nhập
  
      if (+id === +currentUserId) {
        return res.status(400).json({
          success: false,
          message: "Bạn không thể tự khóa tài khoản của chính mình."
        });
      }
  
      let { status, reason } = req.body;
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }
  
      user.status = parseInt(status);
      user.reason = reason || null;
      await user.save();
  
      res.json({ success: true, message: 'Cập nhật trạng thái thành công', data: user });
  
    } catch (err) {
      console.error('❌ Lỗi toggleStatus:', err);
      res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }
  
,  
  

  async resetPassword(req, res) {
    try {
      const { id } = req.params;
  
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }
  
      const newPassword = '12345678';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      // Gửi mail
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: 'Cấp lại mật khẩu',
        html: `
          <p>Xin chào <strong>${user.name}</strong>,</p>
          <p>Mật khẩu mới của bạn là: <strong>${newPassword}</strong></p>
          <p>Vui lòng đăng nhập và thay đổi mật khẩu.</p>
        `,
      });
  
      res.json({ success: true, message: 'Cấp lại mật khẩu và gửi email thành công' });
    } catch (err) {
      console.error('❌ Lỗi khi gửi mail:', err);
      res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }
  
};
