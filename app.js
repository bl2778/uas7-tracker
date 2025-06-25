const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 数据库初始化
const dbPath = path.join(__dirname, 'uas7.db');
const db = new sqlite3.Database(dbPath);

// 初始化数据库表
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS diary_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      wheal_score INTEGER NOT NULL,
      itch_score INTEGER NOT NULL,
      day_score INTEGER NOT NULL,
      aux_factors TEXT,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, date)
    )
  `);
  console.log('✅ 数据库初始化完成');
});

// API路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/diary/:userId', (req, res) => {
  const userId = req.params.userId;
  const startDate = dayjs().subtract(90, 'day').format('YYYY-MM-DD');
  
  db.all(
    'SELECT * FROM diary_entries WHERE user_id = ? AND date >= ? ORDER BY date DESC',
    [userId, startDate],
    (err, rows) => {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
      } else {
        const entries = rows.map(row => ({
          ...row,
          aux_factors: JSON.parse(row.aux_factors || '{}')
        }));
        res.json({ success: true, data: entries });
      }
    }
  );
});

app.post('/api/diary/:userId', (req, res) => {
  const userId = req.params.userId;
  const { date, whealScore, itchScore, auxFactors, note } = req.body;
  const dayScore = parseInt(whealScore) + parseInt(itchScore);
  
  db.run(
    `INSERT OR REPLACE INTO diary_entries 
     (user_id, date, wheal_score, itch_score, day_score, aux_factors, note, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [userId, date, whealScore, itchScore, dayScore, JSON.stringify(auxFactors || {}), note || ''],
    function(err) {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
      } else {
        res.json({ 
          success: true, 
          data: { 
            id: this.lastID, 
            date, 
            whealScore, 
            itchScore, 
            dayScore 
          } 
        });
      }
    }
  );
});

app.get('/api/uas7/:userId', (req, res) => {
  const userId = req.params.userId;
  const startDate = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
  const endDate = dayjs().format('YYYY-MM-DD');
  
  db.all(
    'SELECT date, day_score FROM diary_entries WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date',
    [userId, startDate, endDate],
    (err, rows) => {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
      } else {
        const totalScore = rows.reduce((sum, row) => sum + row.day_score, 0);
        const daysRecorded = rows.length;
        const isComplete = daysRecorded === 7;
        
        let severity;
        if (totalScore <= 6) severity = { level: 'mild', text: '病情控制良好', color: '#52c41a' };
        else if (totalScore <= 15) severity = { level: 'light', text: '轻度活动', color: '#faad14' };
        else if (totalScore <= 27) severity = { level: 'moderate', text: '中度活动，关注治疗', color: '#fa8c16' };
        else severity = { level: 'severe', text: '重度活动，建议就医', color: '#f5222d' };
        
        res.json({
          success: true,
          data: {
            score: totalScore,
            daysRecorded,
            isComplete,
            severity,
            dateRange: { startDate, endDate }
          }
        });
      }
    }
  );
});

// 提供简单的前端页面
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>UAS7 追踪工具</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .card { background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 10px 0; }
            button { background: #007AFF; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
            input, select { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h1>🏥 UAS7 慢性荨麻疹追踪工具</h1>
        
        <div class="card">
            <h2>✅ 系统状态检查</h2>
            <p>部署状态: <span id="status">检查中...</span></p>
            <button onclick="checkHealth()">检查API状态</button>
        </div>

        <div class="card">
            <h2>📝 记录症状</h2>
            <form onsubmit="saveEntry(event)">
                <div>
                    <label>日期:</label>
                    <input type="date" id="date" required>
                </div>
                <div>
                    <label>风团评分 (0-3):</label>
                    <select id="whealScore" required>
                        <option value="">请选择</option>
                        <option value="0">0 - 无</option>
                        <option value="1">1 - 轻微</option>
                        <option value="2">2 - 中度</option>
                        <option value="3">3 - 重度</option>
                    </select>
                </div>
                <div>
                    <label>瘙痒评分 (0-3):</label>
                    <select id="itchScore" required>
                        <option value="">请选择</option>
                        <option value="0">0 - 无</option>
                        <option value="1">1 - 轻微</option>
                        <option value="2">2 - 中度</option>
                        <option value="3">3 - 重度</option>
                    </select>
                </div>
                <div>
                    <label>备注:</label>
                    <input type="text" id="note" placeholder="可选">
                </div>
                <button type="submit">保存记录</button>
            </form>
        </div>

        <div class="card">
            <h2>📊 UAS7 评分</h2>
            <div id="uas7Result">点击按钮获取UAS7评分</div>
            <button onclick="getUAS7()">计算UAS7</button>
        </div>

        <script>
            const userId = 'default-user';
            
            // 设置默认日期为今天
            document.getElementById('date').value = new Date().toISOString().split('T')[0];
            
            async function checkHealth() {
                try {
                    const response = await fetch('/api/health');
                    const data = await response.json();
                    document.getElementById('status').innerHTML = '🟢 正常运行';
                    console.log('Health check:', data);
                } catch (error) {
                    document.getElementById('status').innerHTML = '🔴 连接失败';
                    console.error('Health check failed:', error);
                }
            }
            
            async function saveEntry(event) {
                event.preventDefault();
                
                const data = {
                    date: document.getElementById('date').value,
                    whealScore: document.getElementById('whealScore').value,
                    itchScore: document.getElementById('itchScore').value,
                    auxFactors: {},
                    note: document.getElementById('note').value
                };
                
                try {
                    const response = await fetch(\`/api/diary/\${userId}\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        alert('记录保存成功！');
                        getUAS7(); // 自动更新UAS7评分
                    } else {
                        alert('保存失败: ' + result.error);
                    }
                } catch (error) {
                    alert('保存失败: ' + error.message);
                }
            }
            
            async function getUAS7() {
                try {
                    const response = await fetch(\`/api/uas7/\${userId}\`);
                    const result = await response.json();
                    
                    if (result.success) {
                        const { score, daysRecorded, severity } = result.data;
                        document.getElementById('uas7Result').innerHTML = \`
                            <h3 style="color: \${severity.color}">UAS7评分: \${score}</h3>
                            <p>记录天数: \${daysRecorded}/7 天</p>
                            <p>病情状态: \${severity.text}</p>
                        \`;
                    }
                } catch (error) {
                    console.error('获取UAS7失败:', error);
                }
            }
            
            // 页面加载时检查状态
            checkHealth();
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 UAS7服务器运行在端口 ${PORT}`);
  console.log(`📱 访问地址: http://localhost:${PORT}`);
});
