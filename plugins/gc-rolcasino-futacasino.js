const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;

  // Reacción inicial
  await conn.sendMessage(chatId, {
    react: { text: '🎰', key: msg.key }
  });

  try {
    const rolcasino = `🎰|Comandos Casino/RPG/Economia:

_*[BOT SUMIKA]*_
• #bal - Ver tu balance.
• #einfo - ver info de tu economía.
• #work - Gana Futacoins trabajando.
• #slut - Gana Futacoins prostituyéndote.
• #crime - Gana Futacoins haciendo un crimen.
• #dep - Depositar tus Futacoins en el banco.
• #with - Retirar tus Futacoins del banco.
• #flip - Apostar Futacoins en un cara o cruz.
• #pay [usuario] [cantidad de Futacoins] - Darle Futacoins a un usuario.
• #rt [rojo/negro] [cantidad de Futacoins] - Apuesta Futacoins en una ruleta.
• #rob [usuario] - Intentar robar Futacoins a un usuario.
• #d - Reclama tu recompensa diaria.

_° Mas comandos de Economía/Casino/RPG usando #menu y mira la sección Economy!._

_*[BOT ASAKURA]*_
• .adventure - Comenzar un adventura.
• .cazar - Caza algún objeto.
• .cofre - Abre un cofre.
• .balance - Ver tu balance.
• .claim - Reclamar objeto.
• .work - Trabajar para ganar coins en Asakura.
• .minar - Mina para obtener diamantes.
• .minar2 - Mina para obtener experiencia.
• .buy - Comprar algo en la tienda.
• .robar [cantidad de coins] [usuario] - Robar a un usuario.
• .crime - Cometer un crímen.
• .transfer [coins/diamantes/experiencia] [cantidad de coins/diamantes/experiencia] [usuario] - Transferir a un usuario.

_° Mas comando de Economía usando .menu y mira la sección de Economía!._`;

    // Enviar el mensaje con la info
    await conn.sendMessage(chatId, {
      text: rolcasino
    }, { quoted: msg });

    // Reacción de éxito
    await conn.sendMessage(chatId, {
      react: { text: '✅', key: msg.key }
    });

  } catch (err) {
    console.error('❌ Error en comando rolcasino:', err);
    await conn.sendMessage(chatId, {
      text: '❌ No se pudo enviar la información del casino en este momento.'
    }, { quoted: msg });
  }
};

handler.command = ['rolcasino', 'casinoinfo', 'infoc'];
handler.tags = ['grupo'];
handler.help = ['rolcasino'];
handler.group = true;
handler.reaction = '🎰';

module.exports = handler;
