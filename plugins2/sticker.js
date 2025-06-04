  const handler = async (msg, { conn }) => {
  const rawID = conn.user?.id || "";
  const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";

  // Obtener prefijo del subbot
  const prefixPath = path.resolve("prefixes.json");
  let prefixes = {};
  if (fs.existsSync(prefixPath)) {
    prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
  }
  const usedPrefix = prefixes[subbotID] || ".";

  try {
    let mediaType, mediaMessage;

    // Verificar si es una respuesta a un mensaje con imagen o video
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted) {
      mediaType = quoted.imageMessage ? 'image' : quoted.videoMessage ? 'video' : null;
      mediaMessage = quoted[`${mediaType}Message`];
    }

    // Si no es una respuesta, verificar si el mensaje actual tiene imagen o video
    if (!mediaType) {
      if (msg.message?.imageMessage) {
        mediaType = 'image';
        mediaMessage = msg.message.imageMessage;
      } else if (msg.message?.videoMessage) {
        mediaType = 'video';
        mediaMessage = msg.message.videoMessage;
      }
    }

    // Si no se encontró media válida
    if (!mediaType || !mediaMessage) {
      return await conn.sendMessage(msg.key.remoteJid, {
        text: `⚠️ *Envía o responde a una imagen o video con el comando \`${usedPrefix}s\` para crear un sticker.*`
      }, { quoted: msg });
    }

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '🛠️', key: msg.key }
    });

    const mediaStream = await downloadContentFromMessage(mediaMessage, mediaType);
    let buffer = Buffer.alloc(0);
    for await (const chunk of mediaStream) buffer = Buffer.concat([buffer, chunk]);

    const metadata = {
      packname: `Sticker`,
      author: `ᴀꜱᴀᴋᴜʀᴀ ᴍᴀᴏ ʙᴏᴛ 👑`
    };

    const sticker = mediaType === 'image'
      ? await writeExifImg(buffer, metadata)
      : await writeExifVid(buffer, metadata);

    await conn.sendMessage(msg.key.remoteJid, {
      sticker: { url: sticker }
    }, { quoted: msg });

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '✅', key: msg.key }
    });

  } catch (err) {
    console.error('❌ Error en sticker s:', err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: '❌ *Hubo un error al procesar el sticker. Inténtalo de nuevo.*'
    }, { quoted: msg });

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '❌', key: msg.key }
    });
  }
};
