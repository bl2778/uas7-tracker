const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../../database/uas7.db');
const db = new sqlite3.Database(dbPath);

// 用户ID（单用户模式）
let CURRENT_USER_ID = 'default-user';

// 初始化数据库
function initDatabase() {
  db.serialize(() => {
    // 日记条目表
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
}

// 获取用户ID
function getUserId() {
  return CURRENT_USER_ID;
}

// 获取用户日记条目
function getDiaryEntries(userId, days = 90) {
  return new Promise((resolve, reject) => {
    const startDate = dayjs().subtract(days, 'day').format('YYYY-MM-DD');
    db.all(
      'SELECT * FROM diary_entries WHERE user_id = ? AND date >= ? ORDER BY date DESC',
      [userId, startDate],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const entries = rows.map(row => ({
            ...row,
            aux_factors: JSON.parse(row.aux_factors || '{}')
          }));
          resolve(entries);
        }
      }
    );
  });
}

// 保存日记条目
function saveDiaryEntry(userId, data) {
  return new Promise((resolve, reject) => {
    const { date, whealScore, itchScore, auxFactors, note } = data;
    const dayScore = parseInt(whealScore) + parseInt(itchScore);
    
    db.run(
      `INSERT OR REPLACE INTO diary_entries 
       (user_id, date, wheal_score, itch_score, day_score, aux_factors, note, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [userId, date, whealScore, itchScore, dayScore, JSON.stringify(auxFactors || {}), note || ''],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ 
            id: this.lastID, 
            date, 
            whealScore, 
            itchScore, 
            dayScore,
            note,
            auxFactors 
          });
        }
      }
    );
  });
}

// 计算UAS7分数
function calculateUAS7(userId) {
  return new Promise((resolve, reject) => {
    const startDate = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
    const endDate = dayjs().format('YYYY-MM-DD');
    
    db.all(
      'SELECT date, day_score FROM diary_entries WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date',
      [userId, startDate, endDate],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const totalScore = rows.reduce((sum, row) => sum + row.day_score, 0);
          const daysRecorded = rows.length;
          const isComplete = daysRecorded === 7;
          
          resolve({
            score: totalScore,
            daysRecorded,
            isComplete,
            severity: getSeverityLevel(totalScore),
            dateRange: { startDate, endDate }
          });
        }
      }
    );
  });
}

// 获取严重程度
function getSeverityLevel(score) {
  if (score <= 6) return { level: 'mild', text: '病情控制良好', color: '#52c41a' };
  if (score <= 15) return { level: 'light', text: '轻度活动', color: '#faad14' };
  if (score <= 27) return { level: 'moderate', text: '中度活动，关注治疗', color: '#fa8c16' };
  return { level: 'severe', text: '重度活动，建议就医', color: '#f5222d' };
}

module.exports = {
  initDatabase,
  getDiaryEntries,
  saveDiaryEntry,
  calculateUAS7,
  getUserId
};