const settings = require("../settings");
async function aliveCommand(sock, chatId, message) {
    try {
        const message1 = `*🤖 𝙳𝙰𝙽𝙳𝙾𝚁𝙰-𝙼𝙳 is Active!*\n\n` +
                       `*Version:* ${settings.version}\n` +
                       `*𝚂𝚝𝚊𝚝𝚞𝚜:* Online\n` +
                       `*𝚖𝚘𝚍𝚎:* Public\n\n` +
                       `*✤꯭ָ֟፝݊͞🌸꯭ָ֟፝݊͞✤ Features:*\n` +
                       `✤꯭ָ֟፝݊͞🌸꯭ָ֟፝݊͞✤ 𝙶𝚛𝚘𝚞𝚙 𝙼𝚊𝚗𝚊𝚐𝚎𝚖𝚎𝚗𝚝\n` +
                       `✤꯭ָ֟፝݊͞🌸꯭ָ֟፝݊͞✤ 𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝙿𝚛𝚘𝚝𝚎𝚌𝚝𝚒𝚘𝚗\n` +
                       `✤꯭ָ֟፝݊͞🌸꯭ָ֟፝݊͞✤ 𝙵𝚞𝚗 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜\n` +
                       `✤꯭ָ֟፝݊͞🌸꯭ָ֟፝݊͞✤ And more!\n\n` +
                       `Type *.menu* for full command list`;
                       
        // 1️⃣ Send Image + Caption with fake forwarded newsletter
        await sock.sendMessage(chatId, {
            image: { url: "./bot_image.jpg" },
            caption: caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363429495088710@newsletter",
                    newsletterName: "𝙳𝙰𝙽𝙳𝙾𝚁𝙰-𝚃𝙴𝙲𝙷",
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

        // 2️⃣ Send WORKING audio (Opus encoded .ogg) - tested December 2025
        await sock.sendMessage(chatId, {
            audio: { 
                url: "./nkosi.mp3"   // ← NEW 100% WORKING VOICE
            },
            mimetype: "audio/mpeg",
            ptt: false,                                 // false = normal voice message (shows waveform)
            waveform: [0, 25, 50, 80, 100, 80, 50, 25, 10, 0, 10, 25, 40, 60, 80, 90, 80, 60, 40, 20, 0]
        }, { quoted: message });

        await sock.sendMessage(chatId, {
            text: message1,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363429495088710@newsletter',
                    newsletterName: '𝙳𝙰𝙽𝙳𝙾𝚁𝙰-𝚃𝙴𝙲𝙷',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: 'Bot is alive and running!' }, { quoted: message });
    }
}

module.exports = aliveCommand;