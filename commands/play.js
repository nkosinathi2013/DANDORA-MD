const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();
        
        if (!searchQuery) {
            return await sock.sendMessage(chatId, { 
                text: "𝚆𝚑𝚊𝚝 𝚜𝚘𝚗𝚐 𝚍𝚘 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍?"
            });
        }

        // Search for the song
        const { videos } = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "𝙽𝚘 𝚜𝚘𝚗𝚐𝚜 𝚏𝚘𝚞𝚗𝚍!"
            });
        }

        // Send loading message
        await sock.sendMessage(chatId, {
            text: "_Please wait your download is in progress_"
        });

        // Get the first video result
        const video = videos[0];
        const urlYt = video.url;

        // Fetch audio data from API
        const response = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${urlYt}`);
        const data = response.data;

        if (!data || !data.status || !data.result || !data.result.downloadUrl) {
            return await sock.sendMessage(chatId, { 
                text: "Failed to fetch audio from the API. Please try again later."
            });
        }

        const audioUrl = data.result.downloadUrl;
        const title = data.result.title;

        // Send the audio
        await sock.sendMessage(chatId, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`
        }, { quoted: message });

    } catch (error) {
        console.error('Error in song2 command:', error);
        await sock.sendMessage(chatId, { 
            text: "𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚏𝚊𝚒𝚕𝚎𝚍. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛."
        });
    }
}

module.exports = playCommand; 

/*Powered by KNIGHT-BOT*
*Credits to Keith MD*`*/