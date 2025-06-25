const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase, getDiaryEntries, saveDiaryEntry, calculateUAS7, getUserId } = require('./src/models/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务 - 修改路径
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 初始化数据库
initDatabase();

// API 路由... (保持之前的代码)

// 前端路由 - 必须放在最后
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 UAS7服务器运行在端口 ${PORT}`);
  console.log(`📱 访问地址: http://localhost:${PORT}`);
});
