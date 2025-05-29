const fs = require('fs');
const axios = require('axios');
const fetch = require('node-fetch');
const uploadFile = require('../libs/uploadFile');
const uploadImage = require('../libs/uploadImage');
const { webp2png } = require('../libs/webp2mp4');

const handler = async (msg, { conn, args, usedPrefix, command, text }) => {
  const chatId = msg.key.remoteJid;

  // Reacción inicial
  await conn.sendMessage(chatId, {
    react: { text: '🔍', key: msg.key }
  });

  try {
    let url;
    const q = msg.quoted ? msg.quoted : msg;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    if (text) {
      url = text;
    } else if (msg.quoted && /image\/(png|jpe?g)/.test(mime) || mime.startsWith('image/')) {
      const media = await q.download();
      url = await uploadImage(media);
    } else if (msg.quoted && /image\/webp/.test(mime)) {
      const media = await q.download();
      url = await webp2png(media);
    } else {
      await conn.sendMessage(chatId, {
        text: '❗ Ingresa un enlace o responde con una imagen PNG, JPG o JPEG.'
      }, { quoted: msg });
      return;
    }

    const apiKeys = [
      "45e67c4cbc3d784261ffc83806b5a1d7e3bd09ae",
      "d3a88baf236200c2ae23f31039e599c252034be8",
      "a74012c56b54b8d36d2675e12b1a216809c353fe",
      "9812eb9464efa1201c69e5592ba0c74e7edd95e8",
      "2e7da9f5e70c65f2885b07d48595ba03c4be2ba7",
      "dafca3c54e59ae1b7fea087ca75984f9e64b74e1"
    ];

    let response;
    let success = false;

    for (let i = 0; i < apiKeys.length; i++) {
      try {
        response = await axios.get(`https://saucenao.com/search.php?db=999&output_type=2&numres=6&api_key=${apiKeys[i]}&url=${encodeURIComponent(url)}`);
        success = true;
        break;
      } catch (_) {}
    }

    if (!success) {
      await conn.sendMessage(chatId, {
        text: '❌ No se pudo obtener una respuesta exitosa de SauceNAO.'
      }, { quoted: msg });
      return;
    }

    const result = response.data.results[0];
    let resultadoEnBruto = '';

    for (const prop in result.header) {
      const label = {
        similarity: 'Puntuación de similitud',
        author_name: 'Nombre del autor'
      }[prop] || prop;

      resultadoEnBruto += `*${label}*\n${result.header[prop]}\n\n`;
    }

    for (const prop in result.data) {
      const label = {
        title: 'Título',
        ext_urls: 'URLs',
        member_name: 'Nombre del autor',
        source: 'Fuente',
        author_name: 'Nombre del Autor',
        author_url: 'URL del Autor'
      }[prop] || prop;

      resultadoEnBruto += `*${label}*\n${result.data[prop]}\n\n`;
    }

    const thumb = await (await fetch(result.header.thumbnail)).buffer();
    const mensajePrevia = {
      key: { participant: "0@s.whatsapp.net", remoteJid: "0@s.whatsapp.net" },
      message: {
        groupInviteMessage: {
          groupJid: "51995386439-1616969743@g.us",
          inviteCode: "m",
          groupName: "P",
          caption: "Resultado de búsqueda",
          jpegThumbnail: thumb
        }
      }
    };

    await conn.sendMessage(chatId, {
      text: '_*ESPERE UN MOMENTO...*_'
    }, { quoted: mensajePrevia });

    await conn.sendMessage(chatId, {
      text: `*◎ R E S U L T A D O*\n\n${resultadoEnBruto}`
    }, { quoted: mensajePrevia });

    // Reacción de éxito
    await conn.sendMessage(chatId, {
      react: { text: '✅', key: msg.key }
    });

  } catch (err) {
    console.error('❌ Error en el comando sauce:', err);
    await conn.sendMessage(chatId, {
      text: `❌ Ocurrió un error. Asegúrate de enviar una imagen o URL válida.`
    }, { quoted: msg });
  }
};

handler.command = ['sauce', 'source', 'salsa', 'zelda'];
module.exports = handler;
