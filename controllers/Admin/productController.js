const Product = require("../../models/Admin/productModel");
const Category = require("../../models/Admin/categoryModel");
const { Op } = require("sequelize");

class ProductController {
  // ✅ Lấy danh sách sản phẩm (tìm kiếm, lọc, phân trang)
  // ✅ Lấy danh sách sản phẩm (tìm kiếm, lọc, phân trang)
static async get(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const { search, status, category, sort, createdAt, deletedAt, deleted } = req.query;

    let where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (status !== undefined && status !== "") {
      where.status = parseInt(status);
    }
    if (category && category !== "all") {
      where.idCategory = category;
    }

    // ✅ Nếu đang lọc thùng rác (deleted=true)
    const includeDeleted = deleted === "true";
    if (includeDeleted) {
      // Lọc theo ngày xóa nếu có
      if (deletedAt) {
        const date = new Date(deletedAt);
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        where.deletedAt = {
          [Op.gte]: date,
          [Op.lt]: nextDate,
        };
      } else {
        where.deletedAt = { [Op.ne]: null };
      }
    } else {
      // ✅ Lọc theo ngày tạo nếu không ở tab thùng rác
      if (createdAt) {
        const date = new Date(createdAt);
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        where.createdAt = {
          [Op.gte]: date,
          [Op.lt]: nextDate,
        };
      }
    }

    // ✅ Xử lý sắp xếp
    let order = [];
    if (sort === "asc") order.push(["price", "ASC"]);
    if (sort === "desc") order.push(["price", "DESC"]);

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"], // giới hạn tránh dư thừa
        },
      ],
      attributes: [
        'id',
        'name',
        'description',
        'price',
        'discount_type',
        'discount_value',
        'final_price', // ✅ QUAN TRỌNG!
        'image',
        'status',
        'quantity',
        'idCategory',
        'createdAt',
        'deletedAt'
      ],
      paranoid: !includeDeleted,
    });
    

    res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công",
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
}


  // ✅ Lấy 1 sản phẩm theo ID
  static async getById(req, res) {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [{ model: Category, as: "category" }],
      });
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      res.status(200).json({ message: 'Lấy thành công', data: product }); // ✅ chuẩn

    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }

  // ✅ Tạo sản phẩm mới
  static async create(req, res) {
    try {
      console.log("🟡 BODY:", req.body);
      console.log("🟢 FILES:", req.files);
      console.log("📦 HEADERS:", req.headers);
      console.log("🟡 BODY:", req.body);
      console.log("🟢 FILES:", req.files);

      const data = req.body;

      if (req.files?.image?.[0]) {
        data.image = req.files.image[0].filename; // ✅ đúng tên file đã upload
      }
      
      

      // ✅ Parse số (FormData luôn là string!)
      data.price = parseFloat(data.price);
      data.discountValue = parseFloat(data.discountValue);
      data.finalPrice = parseFloat(data.finalPrice);
      data.quantity = parseInt(data.quantity);
      data.status = parseInt(data.status);
      data.is_feature = parseInt(data.is_feature);
// Tính finalPrice
if (data.discountType === "percentage") {
  data.finalPrice = data.price * (1 - data.discountValue / 100);
} else if (data.discountType === "fixed") {
  data.finalPrice = data.discountValue;
} else {
  data.finalPrice = data.price;
}

      // ✅ Danh mục: kiểm tra mảng hoặc chuỗi
      if (!Array.isArray(data.categories)) {
        data.categories = [data.categories];
      }

      // ✅ Gán idCategory (chọn phần tử đầu tiên)
      data.idCategory = parseInt(data.categories[0]);

      const product = await Product.create({
        name: data.name,
        description: data.description,
        price: data.price,
        discount_type: data.discountType,
        discount_value: data.discountValue,
        final_price: data.finalPrice, // ✅ Sửa lại: final_price snake_case
        is_feature: data.is_feature,
        image: data.image,
        idCategory: data.idCategory,
        status: data.status,
        quantity: data.quantity,
      });
      
      res
        .status(201)
        .json({ message: "Tạo sản phẩm thành công", data: product });
    } catch (err) {
      console.error("🔥 Lỗi tạo sản phẩm:", err);
      res
        .status(500)
        .json({ message: "Tạo sản phẩm thất bại", error: err.message });
    }
  }

  // ✅ Cập nhật sản phẩm
  static async update(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
  
      if (!product) {
        return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
      }
  
      const data = req.body;
      console.log('📦 BODY:', req.body);

      // ✅ Parse các trường số an toàn
      data.price = parseFloat(data.price) || 0;
      data.discount_value = parseFloat(data.discount_value) || 0;
      data.quantity = parseInt(data.quantity) || 0;
      data.status = parseInt(data.status) || 0;
      data.is_feature = parseInt(data.is_feature) || 0;
  
      // ✅ Ảnh mới
      if (req.files?.thumbnail?.[0]) {
        data.image = req.files.thumbnail[0].filename;
      }
  
      // ✅ Gán danh mục
      if (!Array.isArray(data.categories)) {
        data.categories = [data.categories];
      }
      data.idCategory = parseInt(data.categories[0]) || null;
  
      if (!data.idCategory) {
        return res.status(400).json({ success: false, message: 'Danh mục không hợp lệ' });
      }
  
      // ✅ final_price
      if (data.discount_type === "percentage") {
        data.final_price = data.price * (1 - data.discount_value / 100);
      } else if (data.discount_type === "fixed") {
        data.final_price = data.discount_value;
      } else {
        data.final_price = data.price;
      }
  
      // ✅ Debug xem có bị NaN
      console.log("🔧 Dữ liệu cập nhật:", data);
  
      await product.update(data);
  
      res.json({ success: true, message: 'Cập nhật sản phẩm thành công', data: product });
    } catch (err) {
      console.error('🔥 Lỗi khi cập nhật sản phẩm:', err);
      res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }
  

  // ✅ Xóa mềm
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      await product.destroy();
      res.status(200).json({ message: "Xóa thành công" });
    } catch (err) {
      res.status(500).json({ message: "Xóa thất bại", error: err.message });
    }
  }
// ✅ Xóa nhiều sản phẩm (soft delete)
static async deleteMultiple(req, res) {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const deleted = await Product.destroy({
      where: { id: ids },
    });

    res.status(200).json({
      message: "Đã chuyển sản phẩm vào thùng rác",
      deletedCount: deleted,
    });
  } catch (err) {
    res.status(500).json({ message: "Xóa thất bại", error: err.message });
  }
}

  // ✅ Lấy danh sách đã xóa
  static async trash(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { search, category } = req.query;

      let where = {};
      if (search) {
        where.name = { [Op.like]: `%${search}%` };
      }
      if (category && category !== "all") {
        where.idCategory = category;
      }
      where.deletedAt = { [Op.ne]: null };

      const { count, rows } = await Product.findAndCountAll({
        where,
        include: [{ model: Category, as: "category" }],
        limit,
        offset,
        paranoid: false,
      });

      res.status(200).json({
        message: "Danh sách sản phẩm đã xóa",
        data: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }
// ✅ Xóa vĩnh viễn 1 sản phẩm
static async forceDelete(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, { paranoid: false });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    await product.destroy({ force: true });
    res.status(200).json({ message: "Xóa vĩnh viễn thành công" });
  } catch (err) {
    res.status(500).json({ message: "Xóa thất bại", error: err.message });
  }
}

// ✅ Xóa vĩnh viễn nhiều sản phẩm
static async forceDeleteMultiple(req, res) {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const deleted = await Product.destroy({
      where: { id: ids },
      force: true,
    });

    res.status(200).json({ message: "Đã xóa vĩnh viễn", deletedCount: deleted });
  } catch (err) {
    res.status(500).json({ message: "Xóa thất bại", error: err.message });
  }
}

  // ✅ Khôi phục 1 sản phẩm
  static async restore(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, { paranoid: false });
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      await product.restore();
      res.status(200).json({ message: "Khôi phục thành công", data: product });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Khôi phục thất bại", error: err.message });
    }
  }

  // ✅ Khôi phục nhiều sản phẩm
  static async restoreMultiple(req, res) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
      }

      const products = await Product.findAll({
        where: { id: ids },
        paranoid: false,
      });

      for (let product of products) {
        await product.restore();
      }

      res.status(200).json({ message: "Khôi phục nhiều sản phẩm thành công" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Khôi phục thất bại", error: err.message });
    }
  }
}

module.exports = ProductController;
