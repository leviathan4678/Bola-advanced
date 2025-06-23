// middleware/roles.js
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Truy cập bị từ chối. Yêu cầu vai trò Admin.' });
    }
    next();
};

const isManager = (req, res, next) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ msg: 'Truy cập bị từ chối. Yêu cầu vai trò Manager.' });
    }
    next();
};

module.exports = { isAdmin, isManager };
