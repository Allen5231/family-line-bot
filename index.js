require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk'); // 要先載入 line

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);
const app = express();

app.use(express.json());

// 健康檢查路由
app.get('/', (req, res) => res.send('LINE Bot is running'));

// 接收 LINE Webhook
app.post('/webhook', (req, res) => {
  const events = req.body.events;

  const results = events.map(event => {
    if (event.type === 'message' && event.message.type === 'text') {
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `你說了: ${event.message.text}`
      });
    }
    return Promise.resolve(); // 非文字訊息就略過
  });

  Promise.all(results)
    .then(() => res.status(200).end())
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});