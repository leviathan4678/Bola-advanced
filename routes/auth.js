// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Cập nhật để import cả 'teams'
let { users, teams, nextUserId } = require('../data');

// ENDPOINT: Đăng ký người dùng mới
router.post('/register', async (req, res) => {
    // Lấy thêm teamId từ body của request
    const { username, password, name, teamId } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ msg: 'Vui lòng cung cấp username và password.' });
        }
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ msg: 'Tên người dùng đã tồn tại' });
        }

        // --- VALIDATION MỚI ---
        // Kiểm tra xem teamId được cung cấp có hợp lệ không
        const teamExists = teams.find(t => t.id === teamId);
        // Chỉ kiểm tra khi teamId được cung cấp. Nếu không, sẽ dùng giá trị mặc định.
        if (teamId && !teamExists) {
            return res.status(400).json({ msg: 'Team ID không hợp lệ.' });
        }
        // -----------------------

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: nextUserId++,
            username,
            password: hashedPassword,
            name: name || username,
            role: 'user', // Mặc định vai trò là 'user'
            // Gán teamId từ request, hoặc mặc định là 1 nếu không có
            teamId: teamId || 1
        };
        users.push(newUser);

        res.status(201).json({ msg: 'Đăng ký người dùng thành công', user: { id: newUser.id, username: newUser.username } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ');
    }
});

// ENDPOINT: Đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = users.find(u => u.username === username);
        if (!user) return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ' });
        const payload = {
            user: { id: user.id, username: user.username, role: user.role, teamId: user.teamId }
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) { res.status(500).send('Lỗi máy chủ'); }
});

module.exports = router;
