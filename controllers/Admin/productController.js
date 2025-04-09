const Product = require("../../models/admin/productModel");
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
      include: [{ model: Category, as: "category" }],
      paranoid: !includeDeleted, // quan trọng để lấy cả soft-deleted
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
      res.status(200).json(product);
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

      // ✅ Danh mục: kiểm tra mảng hoặc chuỗi
      if (!Array.isArray(data.categories)) {
        data.categories = [data.categories];
      }

      // ✅ Gán idCategory (chọn phần tử đầu tiên)
      data.idCategory = parseInt(data.categories[0]);

      const product = await Product.create(data);
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
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      const data = req.body;
      if (req.file) {
        data.image = req.file.filename;
      }

      await product.update(data);
      res.status(200).json({ message: "Cập nhật thành công", data: product });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Cập nhật thất bại", error: err.message });
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
