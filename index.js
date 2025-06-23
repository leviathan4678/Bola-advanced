// index.js
const express = require('express');
require('dotenv').config();
const app = express();
const port = 6969;
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.listen(port, () => console.log(`Ứng dụng đang chạy tại http://localhost:${port}`));
