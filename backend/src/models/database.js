const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../../database/uas7.db');
const db = new sqlite3.Database(dbPath);

// 用户ID（单用户模式）
let CURRENT_USER_ID = 'default-user';

// ... 保持所有函数不变 ...

module.exports = {
  initDatabase,
  getDiaryEntries,
  saveDiaryEntry,
  calculateUAS7,
  getUserId
};
