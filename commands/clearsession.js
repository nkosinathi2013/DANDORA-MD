const fs = require('fs');
const path = require('path');
const os = require('os');
const isOwnerOrSudo = require('../lib/isOwner');

const channelInfo = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363429495088710@newsletter',
            newsletterName: '𝙳𝙰𝙽𝙳𝙾𝚁𝙰-𝚃𝙴𝙲𝙷',
            serverMessageId: -1
        }
    }
};

async function clearSessionCommand(sock, chatId, msg) {
    try {
        const senderId = msg.key.participant || msg.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        
        if (!msg.key.fromMe && !isOwner) {
            await sock.sendMessage(chatId, { 
                text: '❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚋𝚢 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛!',
                ...channelInfo
            });
            return;
        }

        // Define session directory
        const sessionDir = path.join(__dirname, '../session');

        if (!fs.existsSync(sessionDir)) {
            await sock.sendMessage(chatId, { 
                text: '❌ 𝚂𝚎𝚜𝚜𝚒𝚘𝚗 𝚍𝚒𝚛𝚎𝚌𝚝𝚘𝚛𝚢 𝚗𝚘𝚝 𝚏𝚘𝚞𝚗𝚍!',
                ...channelInfo
            });
            return;
        }

        let filesCleared = 0;
        let errors = 0;
        let errorDetails = [];

        // Send initial status
        await sock.sendMessage(chatId, { 
            text: `🔍 𝙾𝚙𝚝𝚒𝚖𝚒𝚣𝚒𝚗𝚐 𝚜𝚎𝚜𝚜𝚒𝚘𝚗 𝚏𝚒𝚕𝚎𝚜 𝚏𝚘𝚛 𝚋𝚎𝚝𝚝𝚎𝚛 𝚙𝚎𝚛𝚏𝚘𝚛𝚖𝚊𝚗𝚌𝚎...`,
            ...channelInfo
        });

        const files = fs.readdirSync(sessionDir);
        
        // Count files by type for optimization
        let appStateSyncCount = 0;
        let preKeyCount = 0;

        for (const file of files) {
            if (file.startsWith('app-state-sync-')) appStateSyncCount++;
            if (file.startsWith('pre-key-')) preKeyCount++;
        }

        // Delete files
        for (const file of files) {
            if (file === 'creds.json') {
                // Skip creds.json file
                continue;
            }
            try {
                const filePath = path.join(sessionDir, file);
                fs.unlinkSync(filePath);
                filesCleared++;
            } catch (error) {
                errors++;
                errorDetails.push(`Failed to delete ${file}: ${error.message}`);
            }
        }

        // Send completion message
        const message = `✅ 𝚂𝚎𝚜𝚜𝚒𝚘𝚗 𝚏𝚒𝚕𝚎𝚜 𝚌𝚕𝚎𝚊𝚛𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢!\n\n` +
                       `📊 𝚂𝚝𝚊𝚝𝚒𝚜𝚝𝚒𝚌𝚜:\n` +
                       `• 𝚃𝚘𝚝𝚊𝚕 𝚏𝚒𝚕𝚎𝚜 𝚌𝚕𝚎𝚊𝚛𝚎𝚍: ${filesCleared}\n` +
                       `• 𝙰𝚙𝚙 𝚜𝚝𝚊𝚝𝚎 𝚜𝚢𝚗𝚌 𝚏𝚒𝚕𝚎𝚜: ${appStateSyncCount}\n` +
                       `• 𝙿𝚛𝚎-𝚔𝚎𝚢 𝚏𝚒𝚕𝚎𝚜:: ${preKeyCount}\n` +
                       (errors > 0 ? `\n⚠️ Errors encountered: ${errors}\n${errorDetails.join('\n')}` : '');

        await sock.sendMessage(chatId, { 
            text: message,
            ...channelInfo
        });

    } catch (error) {
        console.error('Error in clearsession command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Failed to clear session files!',
            ...channelInfo
        });
    }
}

module.exports = clearSessionCommand; 