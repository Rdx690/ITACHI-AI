const axios = require('axios');

// Temporary storage for search results and quality options
const searchCache = new Map();
const qualityCache = new Map();

async function movieCommand(sock, chatId, message) {
    try {
        // Check if it's a reply to a search results message
        let isReplyToSearch = false;
        let replyNumber = null;

        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;
            const quotedText = quotedMessage.conversation ||
                              quotedMessage.extendedTextMessage?.text || '';
            
            isReplyToSearch = quotedText.includes('MOVIE RESULTS');

            const replyText = message.message?.conversation ||
                             message.message?.extendedTextMessage?.text || '';

            const num = parseInt(replyText);
            if (!isNaN(num) && num > 0) replyNumber = num;
        }

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        let query = text.split(' ').slice(1).join(' ').trim();

        // Handle quality selection
        if (['fhd', 'hd', 'sd'].includes(query.toLowerCase())) {
            return handleQualitySelection(sock, chatId, message, query.toLowerCase());
        }

        // Handle selection via reply
        if (isReplyToSearch && replyNumber !== null) {
            return handleMovieSelection(sock, chatId, message, replyNumber);
        }

        // If no query provided
        if (!query) return sendUsageMessage(sock, chatId, message);

        const selection = parseInt(query);
        if (!isNaN(selection) && selection > 0) {
            return handleMovieSelection(sock, chatId, message, selection);
        }

        await sock.sendMessage(chatId, {
            text: `🔍 *Searching for:* "${query}"`,
            react: { text: '🔎', key: message.key }
        });

        const apiUrl = `https://apis.davidcyriltech.my.id/movies/search?query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });

        if (!data?.status || !data?.results || data.results.length === 0) {
            const searchFail = `┌─❃⌜ SEARCH FAILED ❃ ITACHI-AI ⌟❃─┐
│
├🌸 ❌ Oops! No movies found for "${query}"!
├🌸 🔍 Try different keywords
├🌸 💡 Example: \`.movie naruto\`
└─❃───────────────────────────❃─┘`;

            return sock.sendMessage(chatId, {
                text: searchFail,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363421562914957@newsletter',
                        newsletterName: '❦ ════ •⊰❂ ITACHI-AI ❃  ❂⊱• ════ ❦',
                        serverMessageId: -1
                    }
                }
            });
        }

        searchCache.set(chatId, data.results);

        let resultsMessage = `┌─❃⌜ MOVIE RESULTS ❃ ITACHI-AI ⌟❃─┐
│
├🌸 Found ${data.results.length} results for "${query}"
│
│ *Select a movie by number:*
│`;

        data.results.forEach((movie, index) => {
            resultsMessage += `├🌸 ${index + 1}. ${movie.title.replace(/\|.*$/, '').trim()} (${movie.year})\n`;
        });

        resultsMessage += `│
├💡 Reply with the number to select
└─❃───────────────────────────❃─┘`;

        await sock.sendMessage(chatId, {
            text: resultsMessage,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363421562914957@newsletter',
                    newsletterName: '❦ ════ •⊰❂ ITACHI-AI ❃  ❂⊱• ════ ❦',
                    serverMessageId: -1
                }
            }
        });

    } catch (error) {
        console.error('Movie Command Error:', error);
        const errorBox = `┌─❃⌜ MOVIE ERROR ❃ ITACHI-AI ⌟❃─┐
│
├🌸 ❌ Failed to process your request
├🌸 🔁 Please try again later!
└─❃───────────────────────────❃─┘`;

        await sock.sendMessage(chatId, { text: errorBox });
    }
}

// Handle movie selection with size info
async function handleMovieSelection(sock, chatId, message, selection) {
    const results = searchCache.get(chatId);
    if (!results || selection > results.length) {
        return sock.sendMessage(chatId, {
            text: `┌─❃⌜ INVALID SELECTION ❃ ITACHI-AI ⌟❃─┐
│
├🌸 ❌ Invalid movie number!
├🌸 🔍 Please search again with \`.movie <title>\`
└─❃───────────────────────────❃─┘`
        });
    }

    const movie = results[selection - 1];

    await sock.sendMessage(chatId, {
        text: `⏳ *Fetching details for:* ${movie.title}`,
        react: { text: '⏳', key: message.key }
    });

    const apiUrl = `https://apis.davidcyriltech.my.id/zoom/movie?url=${encodeURIComponent(movie.link.trim())}`;
    const { data } = await axios.get(apiUrl, { timeout: 30000 });

    if (!data?.status || !data?.result) {
        return sock.sendMessage(chatId, {
            text: `┌─❃⌜ DETAILS ERROR ❃ ITACHI-AI ⌟❃─┐
│
├🌸 ❌ Failed to get movie details!
├🌸 🔍 Try again later
└─❃───────────────────────────❃─┘`
        });
    }

    const movieData = data.result;
    const sizeInfo = movieData.size || '';
    let fhdSize = 'Size not available', hdSize = 'Size not available', sdSize = 'Size not available';

    if (sizeInfo.includes('FHD 1080p')) {
        const fhdMatch = sizeInfo.match(/FHD 1080p \| ([\d\.]+\s*(GB|MB))/);
        fhdSize = fhdMatch ? fhdMatch[1] : fhdSize;
    }
    if (sizeInfo.includes('HD 720p')) {
        const hdMatch = sizeInfo.match(/HD 720p \| ([\d\.]+\s*(GB|MB))/);
        hdSize = hdMatch ? hdMatch[1] : hdSize;
    }
    if (sizeInfo.includes('SD 480p')) {
        const sdMatch = sizeInfo.match(/SD 480p \| ([\d\.]+\s*(GB|MB))/);
        sdSize = sdMatch ? sdMatch[1] : sdSize;
    }

    qualityCache.set(chatId, {
        title: movieData.title,
        details: movieData,
        movieLink: movie.link.trim()
    });

    const qualityMessage = `┌─❃⌜ QUALITY SELECTION ❃ ITACHI-AI ⌟❃─┐
│
├🌸 🎬 ${movieData.title}
├🌸 📅 Date: ${movieData.date}
├🌸 👀 Views: ${movieData.view}
│
├🌸 *Available qualities:*
├🌸 FHD - Full HD 1080p | ${fhdSize}
├🌸 HD - HD 720p | ${hdSize}
├🌸 SD - Standard Definition 480p | ${sdSize}
│
├💡 Reply with \`.movie fhd\`, \`.movie hd\`, or \`.movie sd\`
└─❃───────────────────────────❃─┘`;

    await sock.sendMessage(chatId, {
        image: { url: movie.image.trim() },
        caption: qualityMessage,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363421562914957@newsletter',
                newsletterName: '❦ ════ •⊰❂ ITACHI-AI ❃  ❂⊱• ════ ❦',
                serverMessageId: -1
            }
        }
    });
}

// Handle quality selection and download link
async function handleQualitySelection(sock, chatId, message, quality) {
    const movieData = qualityCache.get(chatId);
    if (!movieData) {
        return sock.sendMessage(chatId, {
            text: `┌─❃⌜ SELECTION ERROR ❃ ITACHI-AI ⌟❃─┐
│
├🌸 ❌ No movie selected!
├🌸 🔍 Please search and select a movie first
└─❃───────────────────────────❃─┘`
        });
    }

    await sock.sendMessage(chatId, {
        text: `⏳ *Preparing ${quality.toUpperCase()} download for:* ${movieData.title}`,
        react: { text: '⏳', key: message.key }
    });

    const sizeInfo = movieData.details.size || '';
    let fileSize = 'Size not available';

    if (quality === 'fhd' && sizeInfo.includes('FHD 1080p')) {
        const sizeMatch = sizeInfo.match(/FHD 1080p \| ([\d\.]+\s*(GB|MB))/);
        fileSize = sizeMatch ? sizeMatch[1] : fileSize;
    } else if (quality === 'hd' && sizeInfo.includes('HD 720p')) {
        const sizeMatch = sizeInfo.match(/HD 720p \| ([\d\.]+\s*(GB|MB))/);
        fileSize = sizeMatch ? sizeMatch[1] : fileSize;
    } else if (quality === 'sd' && sizeInfo.includes('SD 480p')) {
        const sizeMatch = sizeInfo.match(/SD 480p \| ([\d\.]+\s*(GB|MB))/);
        fileSize = sizeMatch ? sizeMatch[1] : fileSize;
    }

    const downloadMessage = `┌─❃⌜ DOWNLOAD READY ❃ ITACHI-AI ⌟❃─┐
│
├🌸 🎬 ${movieData.title}
├🌸 📀 Quality: ${quality.toUpperCase()}
├🌸 📦 Size: ${fileSize}
├🌸 👀 Views: ${movieData.details.view}
│
├🌸 ⬇️ *Direct Download Link:*
├🌸 ${movieData.details.dl_link.trim()}
│
├💡 *Note:* Click the link to download the file
└─❃───────────────────────────❃─┘`;

    await sock.sendMessage(chatId, {
        text: downloadMessage,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363421562914957@newsletter',
                newsletterName: '❦ ════ •⊰❂ ITACHI-AI ❃  ❂⊱• ════ ❦',
                serverMessageId: -1
            }
        }
    });
}

// Usage message
async function sendUsageMessage(sock, chatId, message) {
    const usageMessage = `┌─❃⌜ MOVIE SEARCH ❃ ITACHI-AI ⌟❃─┐
│
├🌸 🎬 Search for movies with \`.movie <title>\`
├🌸 💡 Example: \`.movie deadpool\`
└─❃───────────────────────────❃─┘`;

    await sock.sendMessage(chatId, {
        text: usageMessage,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363421562914957@newsletter',
                newsletterName: '❦ ════ •⊰❂ ITACHI-AI ❃  ❂⊱• ════ ❦',
                serverMessageId: -1
            }
        }
    });
}

module.exports = movieCommand;