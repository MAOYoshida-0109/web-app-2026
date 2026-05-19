const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));


//ルート１：トップページ
app.get('/',(req, res) => {
    res.send('トップページです');
});

//ルート２：自己紹介ページ
app.get('/about',(req, res) => {
    res.send('自己紹介ページです');
});

//ルート３：現在時刻を返す
app.get('/time',(req, res) => {
    const now = new Date().toLocaleString('ja-JP');
    res.send('現在時刻:' + now);
});

app.get('/status', (req, res) => {
    res.json({ status: 'ok', message: 'サーバーが動いています' });
});

app.get('/status', (req, res) => {
    res.json({ status: 'ok' , message: 'APIが動いています' });
});


const messages = [];

// GET:メッセージ一覧を取得
app.get('/api/messages',(req, res) => {
    res.json(messages);
});

// POST:メッセージを追加
app.post('/api/messages',(req, res) => {
    const {username, text } = req.body;
    const newMessage = { id: messages.length + 1, username, text };
    messages.push(newMessage);
    res.json(newMessage);
});

app.listen(3000, () => {
    console.log('サーバーが起動しました: http://localhost:3000');
});

