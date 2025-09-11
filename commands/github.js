// GitHub Info Command - Itachi-AI Styled
const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function githubCommand(sock, chatId, message) {
  try {
    // Fetch repo data from GitHub
    const res = await fetch('https://api.github.com/repos/rdx690/SOURAJIT-AI');
    if (!res.ok) throw new Error('Error fetching repository data');
    const json = await res.json();

    // Build stylish Itachi-AI message
    let txt = `┏━═☯═━┓ *ITACHI-AI GITHUB REPO* ┏━═☯═━┓\n\n`;
    txt += `▸ 🛠️ *Name*: ${json.name}\n`;
    txt += `▸ 👀 *Watchers*: ${json.watchers_count}\n`;
    txt += `▸ 💾 *Size*: ${(json.size / 1024).toFixed(2)} MB\n`;
    txt += `▸ ⏱️ *Last Updated*: ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
    txt += `▸ 🔗 *URL*: ${json.html_url}\n`;
    txt += `▸ 🍴 *Forks*: ${json.forks_count}\n`;
    txt += `▸ ⭐ *Stars*: ${json.stargazers_count}\n\n`;
    txt += `⚔️ *Powered by ITACHI-AI*\n`;
    txt += `🩸 *GitHub Repository: rdx690/ITACHI-AI*`;

    // Use local asset image if available
    const imgPath = path.join(__dirname, '../assets/bot_image.jpg');
    let imgBuffer;
    if (fs.existsSync(imgPath)) {
      imgBuffer = fs.readFileSync(imgPath);
    }

    // Send message
    await sock.sendMessage(chatId, { 
      image: imgBuffer, 
      caption: txt 
    }, { quoted: message });

  } catch (error) {
    console.error('GitHub Command Error:', error);
    await sock.sendMessage(chatId, { 
      text: '❌ Error fetching repository information. Please try again later.' 
    }, { quoted: message });
  }
}

module.exports = githubCommand;
