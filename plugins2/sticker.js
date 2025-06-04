try {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const directMedia = msg.message?.imageMessage || msg.message?.videoMessage;
  const isQuoted = !!quoted;
  const mediaMsg = quoted || msg.message;

  const mediaType = mediaMsg?.imageMessage ? 'image' : mediaMsg?.videoMessage ? 'video' : null;
  if (!mediaType) {
    return await conn.sendMessage(msg.key.remoteJid, {
      text: `⚠️ *Envía o responde a una imagen o video con el comando \`${usedPrefix}s\` para crear un sticker.*`
    }, { quoted: msg });
  }

  const senderName = msg.pushName || 'Usuario Desconocido';
  const now = new Date();
  const fechaCreacion = `📅 ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} 🕒 ${now.getHours()}:${now.getMinutes()}`;

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: '🛠️', key: msg.key }
  });

  const mediaStream = await downloadContentFromMessage(
    mediaMsg[mediaType + 'Message'],
    mediaType
  );
  let buffer = Buffer.alloc(0);
  for await (const chunk of mediaStream) buffer = Buffer.concat([buffer, chunk]);

  const metadata = {
    packname: 'Sticker',
    author: 'ᴀꜱᴀᴋᴜʀᴀ ᴍᴀᴏ ʙᴏᴛ 👑'
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
