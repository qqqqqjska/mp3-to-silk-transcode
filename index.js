const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/mp3tosilk', async (req, res) => {
  try {
    const mp3Url = req.query.url;
    if (!mp3Url) return res.status(400).send('缺少url参数');

    const mp3Resp = await axios({
      method: 'GET',
      url: mp3Url,
      responseType: 'stream'
    });

    res.setHeader('Content-Type', 'audio/silk');

    ffmpeg(mp3Resp.data)
      .audioFrequency(16000)
      .audioChannels(1)
      .audioCodec('libsilk')
      .format('silk')
      .pipe(res, { end: true });

  } catch (err) {
    console.error(err);
    res.status(500).send('转码失败');
  }
});

app.listen(port, () => {
  console.log(`转码服务启动，端口${port}`);
});
