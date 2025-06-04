const handler = async (msg, { conn }) => {
  try {
    // Manda el mensaje completo en formato JSON para inspección
    const fullMsg = JSON.stringify(msg.message, null, 2);

    await conn.sendMessage(msg.key.remoteJid, {
      text: `Mensaje completo recibido:\n\n${fullMsg.substring(0, 4000)}` // Whatsapp limita a ~4000 chars
    }, { quoted: msg });

  } catch (e) {
    console.error('Error en debug completo:', e);
    await conn.sendMessage(msg.key.remoteJid, {
      text: '❌ Error interno en debug completo.'
    }, { quoted: msg });
  }
};

handler.command = ['debugfull'];
module.exports = handler;
