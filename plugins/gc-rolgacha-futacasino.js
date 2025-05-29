const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;

  // Reacción inicial
  await conn.sendMessage(chatId, {
    react: { text: '📜', key: msg.key }
  });

  try {
    const casinoInfo = `🎰|Comandos Casino/RPG/Economia:

_*[BOT SUMIKA]*_
• #bal - Ver tu balance.
• #einfo - ver info de tu economía.
• #work - Gana Futacoins trabajando.
• #slut - Gana Futacoins prostituyéndote.
• #crime - Gana Futacoins haciendo un crimen.
• #dep - Depositar tus Futacoins en el banco.
• #with - Retirar tus Futacoins del banco.
• #flip - Apostar Futacoins en un cara o cruz.
• #pay [usuario] [cantidad] - Dar Futacoins a alguien.
• #rt [rojo/negro] [cantidad] - Apuesta en ruleta.
• #rob [usuario] - Robar a otro usuario.
• #d - Reclama tu recompensa diaria.

_*[BOT ASAKURA]*_
• .adventure - Comenzar aventura.
• .cazar - Cazar algo.
• .cofre - Abrir cofre.
• .balance - Ver tu balance.
• .claim - Reclamar objeto.
• .work - Trabajar por coins.
• .minar / .minar2 - Minar diamantes/experiencia.
• .buy / .robar / .crime / .transfer

📌 Usa #menu para más comandos en la sección *Economy*`;

    const gachaInfo = `🌸| Comandos Gacha:

_*[BOT SUMIKA]*_
• #rw - Girar waifu.
• #waifus - Ver tus waifus.
• #c - Reclamar waifu.
• #ginfo - Ver tu información de gacha.
• #trade [tu waifu] [otra waifu] - Intercambio.
• #wshop - Waifus en venta.
• #sell [precio] [waifu] - Vender waifu.
• #buyc [waifu] - Comprar waifu.
• #delwaifu [waifu] - Eliminar waifu.
• #givechar [usuario] [waifu] - Regalar waifu.

📌 Usa #menu y ve la sección *Gacha*`;

    // Enviar menú con botones
    await conn.sendMessage(chatId, {
      text: '¿Qué menú deseas ver?',
      footer: 'Selecciona una opción:',
      templateButtons: [
        {
          index: 1,
          quickReplyButton: {
            displayText: '🎰 Menú Casino',
            id: '#vercasino'
          }
        },
        {
          index: 2,
          quickReplyButton: {
            displayText: '🌸 Menú Gacha',
            id: '#vergacha'
          }
        }
      ]
    }, { quoted: msg });

    // Reacción de éxito
    await conn.sendMessage(chatId, {
      react: { text: '✅', key: msg.key }
    });

    // Listeners para botones (estos se manejan aparte en tu sistema de comandos)
    conn.on('chat-update', async update => {
      const m = update.messages?.[0];
      if (!m?.message) return;

      const buttonId = m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.templateButtonReplyMessage?.selectedId;

      if (buttonId === '#vercasino') {
        await conn.sendMessage(chatId, { text: casinoInfo }, { quoted: m });
      } else if (buttonId === '#vergacha') {
        await conn.sendMessage(chatId, { text: gachaInfo }, { quoted: m });
      }
    });

  } catch (err) {
    console.error('❌ Error en el menú de info:', err);
    await conn.sendMessage(chatId, {
      text: '❌ No se pudo mostrar el menú. Intenta nuevamente.'
    }, { quoted: msg });
  }
};

handler.command = /^menufcasino(bot)?$/i;
handler.tags = ['grupo'];
handler.help = ['info'];
handler.group = true;
handler.reaction = '📜';

module.exports = handler;
