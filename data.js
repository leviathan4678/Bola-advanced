// data.js
const bcrypt = require('bcrypt');
const hashPassword = (password) => bcrypt.hashSync(password, 10);

let teams = [
    { id: 1, name: 'Team Alpha' },
    { id: 2, name: 'Team Bravo' }
];

let users = [
    // Team Alpha
    { id: 10, username: 'user1', password: hashPassword('user123'), name: 'user1', role: 'user', teamId: 1 },
    { id: 11, username: 'user2', password: hashPassword('yourex123'), name: 'Ex lover', role: 'user', teamId: 1 },
    { id: 12, username: 'Leader1', password: hashPassword('Leading789'), name: 'Manager1', role: 'manager', teamId: 1 },
    // Team Bravo
    { id: 20, username: 'diana', password: hashPassword('pass_diana'), name: 'Diana (nạn nhân)', role: 'user', teamId: 2 },
    { id: 21, username: 'Leader2', password: hashPassword('Leading123'), name: 'Manager2', role: 'manager', teamId: 2} ,
    // Admin
    { id: 99, username: 'admin', password: hashPassword('pass_admin'), name: 'Super Admin', role: 'admin', teamId: null }
];
let nextUserId = 100;

let expenseReports = [
    { id: 1001, ownerId: 10, teamId: 1, title: 'Chi phí đi lại của Alice', amount: 500, status: 'pending_approval' },
    { id: 2001, ownerId: 20, teamId: 2, title: 'Chi phí tiếp khách của Diana', amount: 1200, status: 'pending_approval' },
];
let nextReportId = 2002;

module.exports = { users, expenseReports, teams, nextUserId, nextReportId };
