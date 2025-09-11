const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const os = require ('os');
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
┌ ❏ *⌜ ❃ 𝐈𝐓𝐀𝐂𝐇𝐈 - 𝐀𝐈 ❃ ⌟* ❏
│
❃ Owner: ${settings.botOwner || 'Sourajit'}
❃ Prefix: .
❃ User: ${message.pushName}
❃ Version: ${settings.version || '2.0.8'}
❃ Time: ${formatKolkataTime()} (Asia/Kolkata)
❃ Uptime: ${formatUptime(process.uptime())}
❃ Commands: 158
❃ Date: ${new Date().toLocaleDateString('en-GB')}
❃ Mode: ${settings.mode || 'Public'}
└ ❏_________________________◆

┌ ❏ *⌜ GENERAL ⌟* ❏
❃ .help / .menu
❃ .ping
❃ .alive
❃ .tts
❃ .owner
❃ .joke
❃ .quote
❃ .fact
❃ .weather
❃ .news
❃ .attp
❃ .lyrics
❃ .8ball
❃ .groupinfo
❃ .staff
❃ .vv
❃ .trt
❃ .ss
❃ .jid
└ ❏

┌ ❏ *⌜ ADMIN ⌟* ❏
❃ .ban
❃ .promote
❃ .demote
❃ .mute
❃ .unmute
❃ .delete
❃ .kick
❃ .warnings
❃ .warn
❃ .antilink
❃ .antibadword
❃ .clear
❃ .tag
❃ .tagall
❃ .chatbot
❃ .resetlink
❃ .vcf
❃ .antitag
❃ .welcome
❃ .goodbye
└ ❏

┌ ❏ *⌜ OWNER ⌟* ❏
❃ .mode
❃ .autostatus
❃ .clearsession
❃ .antidelete
❃ .cleartmp
❃ .update
❃ .setpp
❃ .autoreact
❃ .autotyping
❃ .autoread
❃ .anticall
└ ❏

┌ ❏ *⌜ IMAGE/STICKER ⌟* ❏
❃ .blur
❃ .simage
❃ .sticker
❃ .tgsticker
❃ .meme
❃ .take
❃ .emojimix
❃ .igs
❃ .igsc
❃ .removebg
❃ .remini
❃ .crop
└ ❏

┌ ❏ *⌜ PIES ⌟* ❏
❃ .pies
❃ .china
❃ .indonesia
❃ .japan
❃ .korea
❃ .hijab
└ ❏

┌ ❏ *⌜ GAME ⌟* ❏
❃ .tictactoe
❃ .hangman
❃ .guess
❃ .trivia
❃ .answer
❃ .truth
❃ .dare
└ ❏

┌ ❏ *⌜ AI ⌟* ❏
❃ .gpt
❃ .gemini
❃ .imagine
❃ .flux
❃ .godszeal
└ ❏

┌ ❏ *⌜ FUN ⌟* ❏
❃ .compliment
❃ .insult
❃ .flirt
❃ .shayari
❃ .goodnight
❃ .roseday
❃ .character
❃ .wasted
❃ .ship
❃ .simp
❃ .stupid
└ ❏

┌ ❏ *⌜ TEXTMAKER ⌟* ❏
❃ .metallic
❃ .ice
❃ .snow
❃ .impressive
❃ .matrix
❃ .light
❃ .neon
❃ .devil
❃ .purple
❃ .thunder
❃ .leaves
❃ .1917
❃ .arena
❃ .hacker
❃ .sand
❃ .blackpink
❃ .glitch
❃ .fire
└ ❏

┌ ❏ *⌜ DOWNLOAD ⌟* ❏
❃ .play
❃ .song
❃ .instagram
❃ .facebook
❃ .tiktok
❃ .video
❃ .ytmp4
❃ .movie
└ ❏

┌ ❏ *⌜ DEVELOPER ⌟* ❏
❃ .createapi
❃ .dev
❃ .developer
└ ❏

┌ ❏ *⌜ TOOLS ⌟* ❏
❃ .tempnum
❃ .templist
❃ .otpbox
└ ❏

┌ ❏ *⌜ MISC ⌟* ❏
❃ .heart
❃ .horny
❃ .circle
❃ .lgbt
❃ .lolice
❃ .its-so-stupid
❃ .namecard
❃ .oogway
❃ .tweet
❃ .ytcomment
❃ .comrade
❃ .gay
❃ .glass
❃ .jail
❃ .passed
❃ .triggered
└ ❏

┌ ❏ *⌜ ANIME ⌟* ❏
❃ .neko
❃ .waifu
❃ .loli
❃ .nom
❃ .poke
❃ .cry
❃ .kiss
❃ .pat
❃ .hug
❃ .wink
❃ .facepalm
└ ❏

┌ ❏ *⌜ GITHUB ⌟* ❏
❃ .git
❃ .github
❃ .sc
❃ .script
❃ .repo
└ ❏

┌ ❏ *⌜ CHANNEL ⌟* ❏
❃ ITACHI-AI ❃
└ ❏

> Powered by *Itachi - AI* ⚡
`;

    await sock.sendMessage(chatId, { text: helpMessage }, { quoted: message });
}

module.exports = helpCommand;
