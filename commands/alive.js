// This plugin was customized for Itachi-AI
// Original base by God's Zeal Tech 

const os = require('os');
const moment = require('moment');
const settings = require('../settings');

// Format uptime properly
function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

// Format RAM usage
function formatRam(total, free) {
    const used = (total - free) / (1024 * 1024 * 1024);
    const totalGb = total / (1024 * 1024 * 1024);
    const percent = ((used / totalGb) * 100).toFixed(1);
    return `${used.toFixed(1)}GB / ${totalGb.toFixed(1)}GB (${percent}%)`;
}

async function aliveCommand(sock, chatId, message) {
    try {
        // System info
        const uptime = formatUptime(process.uptime());
        const ramUsage = formatRam(os.totalmem(), os.freemem());
        const cpuModel = os.cpus()[0].model.split(' ')[0];
        const cpuSpeed = os.cpus()[0].speed;
        const platform = `${process.platform} ${os.release()}`;
        const nodeVersion = process.version.replace('v', '');
        
        // Date & Time
        const now = moment();
        const currentTime = now.format("HH:mm:ss");
        const currentDate = now.format("dddd, MMMM Do YYYY");

        // Animated loading bar
        const loadingBarLength = 15;
        const filledLength = Math.floor(Math.random() * loadingBarLength);
        
        // Alive message (Itachi style)
        const aliveMessage = `┏━═☯═━┓ *ITACHI-AI STATUS* ┏━═☯═━┓
│
▸ 👁️ *Status:* ✅ _Operational_
▸ ⏱️ *Uptime:* ${uptime}
▸ 📅 *Date:* ${currentDate}
▸ ⏰ *Time:* ${currentTime}
▸ 💻 *Platform:* Chrome Ubuntu
▸ 🧠 *Runtime:* Node.js ${nodeVersion}
▸ 📦 *Version:* ${settings.version || '2.0.5'}
▸ 🔐 *Mode:* ${settings.mode || 'Public'}
│
▸ 📊 *System Resources*
   🩸 RAM: ${ramUsage}
   🩸 CPU: ${cpuModel} @ ${cpuSpeed}MHz
   🩸 Platform: ${platform}
│
▸ 📈 *System Health:* 
   ${'🩸'.repeat(filledLength)}${'⚪'.repeat(loadingBarLength - filledLength)} ${Math.floor(Math.random() * 100)}%
│
▸ 🌐 *Bot Features*
   ⚔️ 100+ Commands
   ⚔️ Movie Search & Download
   ⚔️ Group Contact Export
   ⚔️ API Creation Tools
│
▸ ✨ _Thank you for using ITACHI-AI!_
┗━═🩸═━┛
⚡ *ITACHI-AI is running smoothly!* 
💡 _Type .help for command list_
🩸 “Those who forgive themselves, and are able to accept their true nature… They are the strong ones.” 👁️`;

        // Send alive message with picture
        await sock.sendMessage(chatId, {
            image: { url: 'https://files.catbox.moe/7nm4mz.jpg' },
            caption: aliveMessage,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                mentionedJid: [message.key.remoteJid],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401686230159@newsletter',
                    newsletterName: '❦ ════ •⊰❂ ITACHI-AI ❂⊱• ════ ❦',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Alive Command Error:', error);

        const errorBox = `┌ ❏ *⌜ ALIVE ERROR ⌟* ❏
│
├◆ ❌ Failed to check bot status
├◆ 🔍 Error: ${error.message.substring(0, 50)}...
└ ❏`;

        await sock.sendMessage(chatId, {
            text: errorBox,
            react: { text: '❌', key: message.key }
        });
    }
}

module.exports = aliveCommand;