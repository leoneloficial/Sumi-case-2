const axios = require('axios');

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;

  // Reacción inicial
  await conn.sendMessage(chatId, {
    react: { text: '🔞', key: msg.key }
  });

  // Verificación del modo NSFW
  if (!global.db.data.chats[chatId]?.modohorny && msg.isGroup) {
    return await conn.sendMessage(chatId, {
      text: '[ ⚠️ ] Los comandos +18 están desactivados en este grupo. Si eres administrador y deseas activarlos escribe: #enable nsfw'
    }, { quoted: msg });
  }

  try {
    // Obtener una imagen al azar de la lista
    const imageUrl = global.futanari[Math.floor(Math.random() * global.futanari.length)];

    // Enviar la imagen
    await conn.sendMessage(chatId, {
      image: { url: imageUrl },
      caption: '*_ACA TIENES UNA RICA FUTANARI SOLA 🔥_*'
    }, { quoted: msg });

    // Reacción de éxito
    await conn.sendMessage(chatId, {
      react: { text: '✅', key: msg.key }
    });
  } catch (err) {
    console.error('❌ Error en comando futanari:', err);
    await conn.sendMessage(chatId, {
      text: '❌ No pude obtener una futanari en este momento. Intenta más tarde.'
    }, { quoted: msg });
  }
};

handler.command = ['futasolo', 'futanarisolo'];
handler.tags = ['nsfw'];
handler.help = ['futanari'];
handler.reaction = '🔞';
handler.group = true;

module.exports = handler;
