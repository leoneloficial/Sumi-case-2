const fs = require('fs');
const path = require('path');

const handler = async (msg, { conn }) => {
  try {
    const rawID = conn.user?.id || "";
    const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";

    const prefixPath = path.resolve("prefixes.json");
    let prefixes = {};
    if (fs.existsSync(prefixPath)) {
      prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
    }
    const usedPrefix = prefixes[subbotID] || ".";

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const msgContent = msg.message || {};
    const mediaTypes = ['imageMessage', 'videoMessage', 'stickerMessage'];

    const getMediaInfo = (message) => {
      for (const type of mediaTypes) {
        if (message[type]) {
          return { mediaType: type.replace('Message', ''), mediaMessage: message[type] };
        }
      }
      return null;
    };

    let mediaInfo = null;
    if (quoted) {
      mediaInfo = getMediaInfo(quoted);
    }
    if (!mediaInfo) {
      mediaInfo = getMediaInfo(msgContent);
    }

    await conn.sendMessage(msg.key.remoteJid, {
      text: `Debug media info:\n\nMedia detected: ${mediaInfo ? mediaInfo.mediaType : 'None'}\n\nFull media object:\n${JSON.stringify(mediaInfo ? mediaInfo.mediaMessage : {}, null, 2)}`
    }, { quoted: msg });

  } catch (e) {
    console.error('Error en debugmedia:', e);
  }
};

handler.command = ['debugmedia'];
module.exports = handler;
