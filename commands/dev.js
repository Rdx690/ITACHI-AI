// This plugin was created by Itachi-AI
// Don't Edit Or share without giving credits

const settings = require('../settings'); // Import settings

async function devCommand(sock, chatId, message) {
    try {
        const pushname = message.pushName || "there";

        // Developer info
        const devInfo = {
            name: "SOURAJIT",
            whatsapp: "wa.me/916909950582",
            youtube: "https://youtube.com/@SOURAJTAI",
            image: "https://files.catbox.moe/7nm4mz.jpg"
        };

        // Developer message with new Itachi-AI style
        const devMessage = `╭─❏ *⌜ DEVELOPER INFO ⌟* ❏
│
├👋 Hello ${pushname}!
├ I'm *${devInfo.name}*, creator of this smart bot.
│
├─❏ *MY DETAILS:*
├ 🪀 Name: ${devInfo.name}
├ 🪀 WhatsApp: ${devInfo.whatsapp}
├ 🪀 YouTube: ${devInfo.youtube}
│
├─❏ *BOT INFO:*
├ 📦 Bot Name: Itachi-AI
├ 🌐 Version: ${settings.version || '2.0.5'}
├ 🛠️ Features: 100+ Commands
│
├─❏ *SUPPORT ME:*
├ ❤️ Subscribe to my YouTube
├ 💬 Join WhatsApp Community
│
├✨ Thank you for using *Itachi-AI*!
╰─❏
${'='.repeat(30)}
⚡ *SOURAJIT is always working for you!*
💡 Type .help for all commands
${'='.repeat(30)}`;

        // Send message with image and rich context
        await sock.sendMessage(chatId, {
            image: { url: devInfo.image },
            caption: devMessage,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                mentionedJid: [message.key.remoteJid],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363421562914957@newsletter',
                    newsletterName: '❦ ════ •⊰❂ ITACHI-AI ❂⊱• ════ ❦',
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: 'Itachi-AI Bot',
                    body: 'Created with SOURAJIT Tech',
                    thumbnailUrl: devInfo.image,
                    mediaType: 1,
                    renderSmallerThumbnail: true,
                    showAdAttribution: true,
                    mediaUrl: devInfo.youtube,
                    sourceUrl: devInfo.youtube
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Dev Command Error:', error);

        const errorBox = `╭─❏ *⌜ ERROR ⌟* ❏
│
├❌ Failed to display developer information
├🔍 Error: ${error.message.substring(0, 50)}...
╰─❏`;

        await sock.sendMessage(chatId, {
            text: errorBox,
            react: { text: '❌', key: message.key }
        });
    }
}

module.exports = devCommand;