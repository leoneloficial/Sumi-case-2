const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { pipeline } = require('stream');
const streamPipeline = promisify(pipeline);

const handler = async (msg, { conn, text }) => {
  const rawID = conn.user?.id || "";
  const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";

  const prefixPath = path.resolve("prefixes.json");
  let prefixes = {};
  if (fs.existsSync(prefixPath)) {
    prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
  }

  const usedPrefix = prefixes[subbotID] || ".";

  if (!text) {
    return await conn.sendMessage(msg.key.remoteJid, {
      text: `❀ Usa el comando correctamente:\n\n> Ejemplo: *${usedPrefix}play2* La Factoría - Perdoname`
    }, { quoted: msg });
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: '🕐', key: msg.key }
  });

  try {
    const searchUrl = `https://api.neoxr.eu/api/video?q=${encodeURIComponent(text)}&apikey=russellxz`;
    const searchRes = await axios.get(searchUrl);
    const videoInfo = searchRes.data;

    if (!videoInfo || !videoInfo.data?.url) throw new Error('No se pudo encontrar el video');

    const title = videoInfo.title || 'video';
    const thumbnail = videoInfo.thumbnail;
    const duration = videoInfo.fduration || '0:00';
    const views = videoInfo.views || 'N/A';
    const author = videoInfo.channel || 'Desconocido';
    const videoLink = `https://www.youtube.com/watch?v=${videoInfo.id}`;

    const captionPreview = `*「✦」Título:* *${title}*

> ⴵ *Duración:* ${duration}
> ✰ *Vistas:* ${views}
> ✦ *Autor:* ${author}
> 🜸 *Link:* ${videoLink}`;

    await conn.sendMessage(msg.key.remoteJid, {
      image: { url: thumbnail },
      caption: captionPreview
    }, { quoted: msg });

    const qualities = ['720p', '480p', '360p'];
    let videoData = null;

    for (let quality of qualities) {
      try {
        const apiUrl = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(videoLink)}&apikey=russellxz&type=video&quality=${quality}`;
        const response = await axios.get(apiUrl);
        if (response.data?.status && response.data?.data?.url) {
          videoData = {
            url: response.data.data.url,
            title: response.data.title || title,
            id: response.data.id || videoInfo.id
          };
          break;
        }
      } catch { continue; }
    }

    if (!videoData) throw new Error('No se pudo obtener el video');

    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const filePath = path.join(tmpDir, `${Date.now()}_video.mp4`);

    const resDownload = await axios.get(videoData.url, {
      responseType: 'stream',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    await streamPipeline(resDownload.data, fs.createWriteStream(filePath));

    const stats = fs.statSync(filePath);
    if (!stats || stats.size < 100000) {
      fs.unlinkSync(filePath);
      throw new Error('El video descargado está vacío o incompleto');
    }

    const finalText = ``;

    await conn.sendMessage(msg.key.remoteJid, {
      document: fs.readFileSync(filePath),
      mimetype: 'video/mp4',
      fileName: `${videoData.title}.mp4`,
      caption: finalText
    }, { quoted: msg });

    fs.unlinkSync(filePath);

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '✅', key: msg.key }
    });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: `❌ *Error:* ${err.message}`
    }, { quoted: msg });
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '❌', key: msg.key }
    });
  }
};

handler.command = ['play2'];
module.exports = handler;
