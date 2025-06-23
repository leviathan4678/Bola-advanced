// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
let { users } = require('../data');
router.use(auth);

// LỖ HỔNG BOLA: Xem thông tin chi tiết của một người dùng bất kỳ
router.get('/:userId', (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ msg: 'Không tìm thấy người dùng' });

    // LỖ HỔNG: Không kiểm tra quyền. Bất kỳ ai đăng nhập cũng có thể xem profile người khác.
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// LỖ HỔNG MASS ASSIGNMENT: Cập nhật thông tin cá nhân
router.put('/me/profile', (req, res) => {
    const userToUpdate = users.find(u => u.id === req.user.id);
    if (!userToUpdate) return res.status(404).json({ msg: 'Không tìm thấy người dùng' });
    
    // LỖ HỔNG: Gán tất cả các trường từ body một cách mù quáng
    Object.assign(userToUpdate, req.body);
    
    const { password, ...userWithoutPassword } = userToUpdate;
    res.json({ msg: 'Cập nhật profile thành công', user: userWithoutPassword });
});

module.exports = router;
