const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn }) => {
  const rawID = conn.user?.id || "";
  const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";

  const prefixPath = path.resolve("prefixes.json");
  let prefixes = {};
  if (fs.existsSync(prefixPath)) {
    prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
  }
  const usedPrefix = prefixes[subbotID] || ".";
  const userId = msg.key.participant || msg.key.remoteJid;

  // Reacción normal (no cambia)
  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🩷", key: msg.key }
  });

  const menu = `> ✿ bienvenid@ al menú del subot de sumi sakurasawa

✐; *✿*→ ᴘᴀʀᴀ ᴄʀᴇᴀʀ ᴜɴ sᴜʙ-ʙᴏᴛ ᴄᴏɴ ᴛᴜ ɴᴜᴍᴇʀᴏ ᴜᴛɪʟɪᴢᴀ *#qr* o *#code*
#✎ ${usedPrefix}serbot / qr
#✎ ${usedPrefix}code / codigo 
#✎ ${usedPrefix}sercode / codigo
> esto es para que te hagas Sub bot 

➮   *IA PUEDES RESPUESTA*

#✎ ${usedPrefix}chatgpt
#✎ ${usedPrefix}geminis
> ᥫ᭡con la ia puedes buscar lo que quieras puede servir para los estudios 

➮    *DESCARGAS*

#✎ ${usedPrefix}play / ${usedPrefix}playdoc
#✎ ${usedPrefix}play2 / ${usedPrefix}play2doc
#✎ ${usedPrefix}play5
#✎ ${usedPrefix}play6
#✎ ${usedPrefix}ytmp3 / ${usedPrefix}ytmp3doc
#✎ ${usedPrefix}ytmp35
#✎ ${usedPrefix}ytmp4 / ${usedPrefix}ytmp4doc
#✎ ${usedPrefix}ytmp45
#✎ ${usedPrefix}apk
#✎ ${usedPrefix}instagram / ${usedPrefix}ig
#✎ ${usedPrefix}tiktok / ${usedPrefix}tt
#✎ ${usedPrefix}facebook / ${usedPrefix}fb
> ᥫ᭡con esto puedes descargar lo que gustes con el enlace o sin el enlace 

➮   *sticker y mas*

#✎ ${usedPrefix}s
#✎ ${usedPrefix}ver
#✎ ${usedPrefix}toaudio 
#✎ ${usedPrefix}hd
#✎ ${usedPrefix}toimg
#✎ ${usedPrefix}whatmusic
#✎ ${usedPrefix}tts
#✎ ${usedPrefix}perfil
> ᥫ᭡puedes hacer stickers y mejorar imágenes o saber que música buscas etc. 

➮   *GRUPO*

#✎ ${usedPrefix}abrirgrupo
#✎ ${usedPrefix}cerrargrupo
#✎ ${usedPrefix}infogrupo
#✎ ${usedPrefix}kick
#✎ ${usedPrefix}modoadmins on o off
#✎ ${usedPrefix}antilink on o off
#✎ ${usedPrefix}welcome on o off
#✎ ${usedPrefix}tag
#✎ ${usedPrefix}tagall / ${usedPrefix}invocar / ${usedPrefix}todos
#✎ ${usedPrefix}infogrupo
#✎ ${usedPrefix}damelink
> ᥫ᭡puedes configurar el. bot en los grupos

➮   *COMANDO Y JUEGOS*

#✎ ${usedPrefix}verdad
#✎ ${usedPrefix}reto
#✎ ${usedPrefix}memes o meme
> ᥫ᭡comandos de juegos 

➮ *CONFIGURACIÓN OWENER*

#✎ ${usedPrefix}setprefix ↷
  Cambiar prefijo del subbot
#✎ ${usedPrefix}creador ↷
  Contacto del creador
#✎ ${usedPrefix}get ↷
  Descargar estados
#✎ ${usedPrefix}addgrupo ↷
  Autorizar grupo pa que lo usen.
#✎ ${usedPrefix}addlista ↷
  Autorizar usuario privado pa lo usen.
#✎ ${usedPrefix}dellista ↷
  Quitar usuario autorizado pa que o lo usen.
#✎ ${usedPrefix}delgrupo ↷
  Eliminar grupo autorizado pa que no lo usen.
#✎ ${usedPrefix}pong ↷
  Medir latencia del bot
> ᥫ᭡aquí sólo puede ser el creador o personas de colaboración`;

  // Mensaje principal con sendMessage2
  await conn.sendMessage2(
    msg.key.remoteJid,
    {
      image: { url: `https://cdn.russellxz.click/d06910d4.PNG` },
      caption: menu
    },
    msg
  );

  // Reacción final normal (no cambia)
  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "✅", key: msg.key }
  });
};

handler.command = ['menu', 'help', 'ayuda', 'comandos'];
module.exports = handler;
