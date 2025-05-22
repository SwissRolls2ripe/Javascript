const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// 启用CORS以允许前端访问
app.use(cors());

// 封装重连逻辑
function connectWithRetry() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'Hisense'
  });

  connection.connect(err => {
    if (err) {
      console.error('数据库连接失败:', err);
      setTimeout(connectWithRetry, 3000); // 3秒后重试
    } else {
      console.log('成功连接到MySQL数据库');
      // 挂载到全局，供后续查询使用
      global.connection = connection;
    }
  });

  // 监听连接断开自动重连
  connection.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('数据库连接丢失，尝试重连...');
      connectWithRetry();
    } else {
      throw err;
    }
  });
}

connectWithRetry();

// 图书API路由
app.get('/api/books', (req, res) => {
  const conn = global.connection;
  if (!conn) {
    return res.status(500).json({ error: '数据库未连接' });
  }
  conn.query('SELECT * FROM books', (err, results) => {
    if (err) {
      console.error('查询数据库失败:', err);
      return res.status(500).json({ error: '获取图书数据失败' });
    }
    res.json(results);
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});