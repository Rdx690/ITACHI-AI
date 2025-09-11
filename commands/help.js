const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const os = require('os');

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

// Count total commands
function countCommands() {
    return 133; // Replace with actual command count
}

// Get Asia/Kolkata Time
function getKolkataTime() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
}
function formatKolkataTime() {
    const t = getKolkataTime();
    return `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`;
}

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
┌ ❏ *⌜ 𝐈𝐓𝐀𝐂𝐇𝐈 - 𝐀𝐈 ⌟* ❏
│
❃ Owner: ${settings.botOwner || 'SOURAJIT-AI'}
❃ Prefix: .
❃ User: ${message.pushName}
❃ Version: ${settings.version || '2.0.5'}
❃ Time: ${formatKolkataTime()} (Asia/Kolkata)
❃ Uptime: ${formatUptime(process.uptime())}
❃ Commands: ${countCommands()}
❃ Date: ${new Date().toLocaleDateString('en-GB')}
❃ Mode: ${settings.mode || 'Public'}
└ ❏

┌ ❏ *⌜ GENERAL ⌟* ❏
❃ .help / .menu
❃ .ping
❃ .alive
❃ .owner
❃ .joke
❃ .quote
❃ .weather <city>
└ ❏

┌ ❏ *⌜ ADMIN ⌟* ❏
❃ .kick @user
❃ .promote @user
❃ .demote @user
❃ .tagall
❃ .antilink
❃ .welcome <on/off>
└ ❏

┌ ❏ *⌜ AI ⌟* ❏
❃ .gpt <question>
❃ .gemini <query>
❃ .imagine <prompt>
└ ❏

┌ ❏ *⌜ DOWNLOAD ⌟* ❏
❃ .song <name>
❃ .video <name>
❃ .ytmp3 <url>
❃ .ytmp4 <url>
❃ .instagram <url>
❃ .tiktok <url>
└ ❏

┌ ❏ *⌜ FUN ⌟* ❏
❃ .truth
❃ .dare
❃ .tictactoe @user
❃ .meme
❃ .flirt
❃ .shayari
└ ❏

┌ ❏ *⌜ TOOLS ⌟* ❏
❃ .jid
❃ .link
❃ .ss <url>
❃ .trt <txt> <lang>
└ ❏

> Powered by *Itachi - AI* ⚡
`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');

        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363421562914957@newsletter',
                        newsletterName: '❦ ITACHI-AI ❦',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363421562914957@newsletter',
                        newsletterName: '❦ iTACHI-AI ❦',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage }, { quoted: message });
    }
}

module.exports = helpCommand;
