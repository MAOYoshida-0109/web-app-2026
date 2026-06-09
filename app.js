require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

console.log('DB_USER=', process.env.DB_USER);
console.log('PASSWORDあり=', !!process.env.DB_PASSWORD);

const app = express();

app.use(express.json());
app.use(express.static('public'));

console.log('DB_HOST=', process.env.DB_HOST);
console.log('DB_USER=', process.env.DB_USER);
console.log('DB_NAME=', process.env.DB_NAME);
console.log('DB_PORT=', process.env.DB_PORT);
console.log('PASSWORDあり=', !!process.env.DB_PASSWORD);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  passwordExists: !!process.env.DB_PASSWORD
});


// GET メッセージ一覧取得
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM messages ORDER BY id ASC'
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});


// POST メッセージ追加
app.post('/api/messages', async (req, res) => {
  try {
    console.log('受信データ:', req.body);

    const { username, text } = req.body;

    if (!username || !text) {
      return res.status(400).json({
        error: 'username and text are required'
      });
    }

    const result = await pool.query(
      'INSERT INTO messages (username, text) VALUES ($1, $2) RETURNING *',
      [username, text]
    );

    console.log('保存成功:', result.rows[0]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error('POSTエラー:', err);

    res.status(500).json({
      error: 'DB error'
    });
  }
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`サーバーが起動しました: http://localhost:${process.env.PORT || 3000}`);
});

const path = require('path');

// トップページ表示
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});
