// routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { users, expenseReports, teams } = require('../data');

// Áp dụng middleware `auth` và `isAdmin` cho tất cả các route trong file này
router.use(auth, isAdmin);

// ENDPOINT: Lấy thống kê toàn bộ hệ thống (chỉ admin mới có quyền)
router.get('/stats', (req, res) => {
    // Đây là một ví dụ về endpoint mà chỉ admin mới có thể truy cập
    // để xem thông tin tổng quan của hệ thống.
    res.json({
        totalUsers: users.length,
        totalReports: expenseReports.length,
        totalTeams: teams.length,
        message: `Chào mừng Admin ${req.user.username}!`
    });
});

module.exports = router;
