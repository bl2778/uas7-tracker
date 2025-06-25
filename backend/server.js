const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase, getDiaryEntries, saveDiaryEntry, calculateUAS7, getUserId } = require('./src/models/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 初始化数据库
initDatabase();

// API 路由
app.get('/api/user', (req, res) => {
  const userId = getUserId();
  res.json({ userId });
});

app.get('/api/diary/:userId', async (req, res) => {
  try {
    const entries = await getDiaryEntries(req.params.userId);
    res.json({ success: true, data: entries });
  } catch (error) {
    console.error('获取日记条目错误:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/diary/:userId', async (req, res) => {
  try {
    const entry = await saveDiaryEntry(req.params.userId, req.body);
    const uas7 = await calculateUAS7(req.params.userId);
    res.json({ success: true, data: { entry, uas7 } });
  } catch (error) {
    console.error('保存日记条目错误:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/uas7/:userId', async (req, res) => {
  try {
    const uas7 = await calculateUAS7(req.params.userId);
    res.json({ success: true, data: uas7 });
  } catch (error) {
    console.error('计算UAS7错误:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 前端路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 UAS7服务器运行在端口 ${PORT}`);
  console.log(`📱 访问地址: http://localhost:${PORT}`);
});
