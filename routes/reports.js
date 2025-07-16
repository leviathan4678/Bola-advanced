// routes/reports.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isManager } = require('../middleware/roles');
let { expenseReports, users } = require('../data');
router.use(auth);

// Lấy danh sách báo cáo (an toàn)
router.get('/', (req, res) => { /* ... */ });

// --- PHẦN ĐƯỢC BỔ SUNG ---
// Tạo một báo cáo mới (an toàn)
router.post('/', (req, res) => {
    const { title, amount, description } = req.body;

    if (!title || !amount) {
        return res.status(400).json({ msg: 'Vui lòng cung cấp tiêu đề và số tiền' });
    }

    const newReport = {
        id: Date.now(), // Tạo ID duy nhất dựa trên timestamp
        ownerId: req.user.id, // Lấy ID từ token của người dùng đã đăng nhập
        teamId: req.user.teamId, // Lấy teamId từ token
        title,
        amount: parseFloat(amount),
        description: description || '',
        status: 'pending'
    };

    expenseReports.push(newReport);
    res.status(201).json(newReport);
});
// --- KẾT THÚC PHẦN BỔ SUNG ---

// LỖ HỔNG 1: Lấy chi tiết một báo cáo bất kỳ
router.get('/:reportId', (req, res) => {
    const report = expenseReports.find(r => r.id === parseInt(req.params.reportId));
    if (!report) return res.status(404).json({ msg: 'Không tìm thấy báo cáo' });
    res.json(report);
});

// LỖ HỔNG 2: Phê duyệt một báo cáo
router.post('/:reportId/approve', isManager, (req, res) => {
    const report = expenseReports.find(r => r.id === parseInt(req.params.reportId));
    if (!report) return res.status(404).json({ msg: 'Không tìm thấy báo cáo' });
    report.status = 'approved';
    res.json({ msg: `Báo cáo ${report.id} đã được phê duyệt`, report });
});

// LỖ HỔNG 3: Chiếm đoạt một báo cáo
router.put('/:reportId/assign', (req, res) => {
    const { newOwnerId } = req.body;
    const reportId = parseInt(req.params.reportId, 10);
    const report = expenseReports.find(r => r.id === reportId);
    if (!report) return res.status(404).json({ msg: 'Không tìm thấy báo cáo' });
    const newOwner = users.find(u => u.id === newOwnerId);
    if (!newOwner) return res.status(404).json({ msg: 'Không tìm thấy người dùng mới' });
    report.ownerId = newOwner.id;
    report.teamId = newOwner.teamId;
    res.json({ msg: `Báo cáo ${report.id} đã được gán cho người dùng ${newOwner.id}`, report });
});

// LỖ HỔNG 4 (MỚI): Xóa một báo cáo bất kỳ
router.delete('/:reportId', (req, res) => {
    const reportId = parseInt(req.params.reportId);
    const reportIndex = expenseReports.findIndex(r => r.id === reportId);

    if (reportIndex === -1) {
        return res.status(404).json({ msg: 'Không tìm thấy báo cáo' });
    }

    // LỖ HỔNG: Không có bất kỳ bước kiểm tra quyền sở hữu nào.
    // Bất kỳ người dùng nào đã đăng nhập cũng có thể xóa báo cáo của người khác.
    const deletedReport = expenseReports.splice(reportIndex, 1);
    res.json({ msg: 'Xóa báo cáo thành công', deletedReport: deletedReport[0] });
});

module.exports = router;
