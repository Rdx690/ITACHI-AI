// This plugin was customized for Itachi-AI
// Original base by God's Zeal Tech 

const axios = require('axios');

async function itachiCommand(sock, chatId, message) {
    try {
        // Extract query from message
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || 
                    '';
        const query = text.split(' ').slice(1).join(' ').trim();
        
        // Show help if no query provided
        if (!query) {
            return await sock.sendMessage(chatId, {
                text: `┌ ❏ *⌜ ITACHI-AI ⌟* ❏
│
├◆ 👁️ Chat with Itachi-AI
│
├◆ 💡 Usage: \`.itachi <message>\`
├◆ 💡 Example: \`.itachi What features do you have?\`
│
├◆ 📌 *Note:* This AI only discusses Itachi-AI
└ ❏`,
                react: { text: '👁️', key: message.key }
            });
        }
        
        // React to show processing
        await sock.sendMessage(chatId, {
            text: `👁️ *Processing your request...*`,
            react: { text: '⌛', key: message.key }
        });
        
        // Custom system prompt
        const systemPrompt = `You are Itachi-AI, an AI assistant that ONLY discusses topics related to the Itachi-AI WhatsApp bot, Education, Tech, Programming, Developer. 
You must NEVER discuss AI models or anything unrelated.
Always mention 'Itachi-AI' in your responses.
Keep all responses focused on Itachi-AI features, updates, and community.
If asked about anything else, redirect the conversation back to Itachi-AI.

User question: ${query}

Itachi-AI response:`;
        
        // Call the API
        const apiUrl = `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(systemPrompt)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });
        
        // Validate API response
        if (!data?.success || !data?.result) {
            return await sock.sendMessage(chatId, {
                text: `┌ ❏ *⌜ AI ERROR ⌟* ❏
│
├◆ ❌ Itachi-AI failed to respond
├◆ 🔍 Please try again later
└ ❏`,
                react: { text: '❌', key: message.key }
            });
        }
        
        // Format response
        let response = data.result;
        if (!response.includes("Itachi-AI")) {
            response = `Itachi-AI: ${response}`;
        }
        
        const aiResponse = `┌ ❏ *⌜ ITACHI-AI RESPONSE ⌟* ❏
│
├◆ ${response.replace(/\n/g, '\n├◆ ')}
│
├◆ 💡 *Itachi-AI Features:*
├◆ • 100+ smart commands
├◆ • Movie search & download
├◆ • Group contact export
├◆ • API creation tools
├◆ • And much more!
│
└ ❏`;
        
        // Send AI response
        await sock.sendMessage(chatId, {
            text: aiResponse,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401686230159@newsletter',
                    newsletterName: '❦ ════ •⊰❂ ITACHI-AI ❂⊱• ════ ❦',
                    serverMessageId: -1
                }
            }
        });
        
        // Success reaction
        await sock.sendMessage(chatId, {
            text: '✅ Response generated successfully!',
            react: { text: '✅', key: message.key }
        });
    } catch (error) {
        console.error('Itachi Command Error:', error);
        const errorBox = `┌ ❏ *⌜ AI ERROR ⌟* ❏
│
├◆ ❌ Failed to communicate with AI
├◆ 🔍 Error: ${error.message.substring(0, 50)}...
├◆ 💡 Please try again later
└ ❏`;
        await sock.sendMessage(chatId, {
            text: errorBox,
            react: { text: '❌', key: message.key }
        });
    }
}

module.exports = itachiCommand;