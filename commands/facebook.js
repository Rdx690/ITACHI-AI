// This plugin was customized for Itachi-AI
// Original base by David Cyril

const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function facebookCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const url = text.split(' ').slice(1).join(' ').trim();
        
        if (!url) {
            return await sock.sendMessage(chatId, { 
                text: "❌ Please provide a Facebook video URL.\n💡 Example: .fb https://www.facebook.com/..."
            });
        }

        if (!url.includes('facebook.com')) {
            return await sock.sendMessage(chatId, { 
                text: "❌ That is not a valid Facebook link."
            });
        }

        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key }
        });

        const response = await axios.get(`https://api.dreaded.site/api/facebook?url=${url}`);
        const data = response.data;

        if (!data || data.status !== 200 || !data.facebook || !data.facebook.sdVideo) {
            return await sock.sendMessage(chatId, { 
                text: "⚠️ Sorry, the API didn't respond correctly. Please try again later!"
            });
        }

        const fbvid = data.facebook.sdVideo;

        if (!fbvid) {
            return await sock.sendMessage(chatId, { 
                text: "⚠️ Unable to fetch the video. Please ensure the video exists and is public."
            });
        }

        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        const tempFile = path.join(tmpDir, `fb_${Date.now()}.mp4`);

        const videoResponse = await axios({
            method: 'GET',
            url: fbvid,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Range': 'bytes=0-',
                'Connection': 'keep-alive',
                'Referer': 'https://www.facebook.com/'
            }
        });

        const writer = fs.createWriteStream(tempFile);
        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        if (!fs.existsSync(tempFile) || fs.statSync(tempFile).size === 0) {
            throw new Error('Failed to download video');
        }

        await sock.sendMessage(chatId, {
            video: { url: tempFile },
            mimetype: "video/mp4",
            caption: `🎴 *Facebook Video Downloaded Successfully!*\n\n⚔️ Powered by *Itachi-AI*\n🔗 URL: ${url}`,
        }, { quoted: message });

        try { fs.unlinkSync(tempFile); } catch (err) { console.error('Error cleaning up temp file:', err); }

    } catch (error) {
        console.error('Error in Facebook command:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ An error occurred. API might be down.\n💡 Error: ${error.message}`
        });
    }
}

module.exports = facebookCommand;