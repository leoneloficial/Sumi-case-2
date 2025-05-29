let handler = async (m, { conn }) => {
m.reply(global.discord)}
handler.help = ['discord']
handler.tags = ['grupo']
handler.command = /^(serverdis|serverdiscord|discord|grupodiscord|linkdiscord)$/i
handler.group = true;

global.discord = `Nuestro Server de Discord!
Link: https://discord.gg/UjdSaTESQG`
