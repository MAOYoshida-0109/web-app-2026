require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});


// GET タスク一覧取得
app.get('/api/tasks', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM tasks ORDER BY id ASC'
  );

  res.json(result.rows);
});


// POST タスク追加
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;

  const result = await pool.query(
    'INSERT INTO tasks (title, completed) VALUES ($1, $2) RETURNING *',
    [title, false]
  );

  console.log(result.rows[0]);

  res.json(result.rows[0]);
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`サーバーが起動しました: http://localhost:${process.env.PORT || 3000}`);
});