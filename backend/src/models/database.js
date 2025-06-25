// backend/src/models/database.js
import sqlite3 from 'sqlite3';
import path from 'path';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database/uas7.db');
const db = new sqlite3.Database(dbPath);

// 其余代码保持不变...
// (保持之前的所有函数实现)

export {
  initDatabase,
  getDiaryEntries,
  saveDiaryEntry,
  calculateUAS7,
  getUserId
};
