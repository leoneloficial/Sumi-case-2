const { execSync } = require('child_process');
const fs = require('fs');

const handler = async (msg, { conn, text }) => {
  const chatId = msg.key.remoteJid;

  // Reacción inicial
  await conn.sendMessage(chatId, {
    react: { text: '⬇️', key: msg.key }
  });

  try {
    const { db } = global;
    const idioma = db?.data?.users?.[msg.sender]?.language || global.defaultLenguaje;
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
    const tradutor = _translate.plugins.propietario_actualizar;

    try {
      const stdout = execSync('git pull' + (msg.fromMe && text ? ' ' + text : ''));
      let messager = stdout.toString();

      if (messager.includes('Already up to date.')) {
        messager = tradutor.texto1;
      } else if (messager.includes('Updating')) {
        messager = tradutor.texto2 + '\n\n' + stdout.toString();
      }

      await conn.sendMessage(chatId, { text: messager }, { quoted: msg });

      // Reacción de éxito
      await conn.sendMessage(chatId, {
        react: { text: '✅', key: msg.key }
      });

    } catch {
      const status = execSync('git status --porcelain');
      if (status.length > 0) {
        const conflictedFiles = status
          .toString()
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => {
            if (
              line.includes('.npm/') || line.includes('.cache/') ||
              line.includes('tmp/') || line.includes('MysticSession/') ||
              line.includes('npm-debug.log')
            ) return null;
            return '*→ ' + line.slice(3) + '*';
          })
          .filter(Boolean);

        if (conflictedFiles.length > 0) {
          const errorMessage = `${tradutor.texto3}\n\n${conflictedFiles.join('\n')}.*`;
          await conn.sendMessage(chatId, { text: errorMessage }, { quoted: msg });
        }
      }
    }
  } catch (error) {
    console.error(error);
    let errorMessage2 = '❌ Ocurrió un error al intentar traducir o acceder a la base de datos.';
    if (error.message) {
      errorMessage2 += '\n*- Mensaje de error:* ' + error.message;
    }
    await conn.sendMessage(chatId, { text: errorMessage2 }, { quoted: msg });
  }
};

handler.command = ['update', 'actualizar', 'gitpull'];
handler.rowner = true;

module.exports = handler;
