const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const checkJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Lưu thông tin người dùng vào request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }
};

// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 1) {  // Giả sử role = 1 là admin
        return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }
    next();
};

module.exports = { checkJWT, isAdmin };
