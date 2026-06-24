const isAdmin = require('../lib/isAdmin');  // Move isAdmin to helpers

async function tagAllCommand(sock, chatId, senderId, message) {
    try {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);
        

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { text: '𝙿𝚕𝚎𝚊𝚜𝚎 𝚖𝚊𝚔𝚎 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚏𝚒𝚛𝚜𝚝.' }, { quoted: message });
            return;
        }

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { text: '𝙾𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚎 .𝚝𝚊𝚐𝚊𝚕𝚕 𝚌𝚘𝚖𝚖𝚊𝚗𝚍.' }, { quoted: message });
            return;
        }

        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;

        if (!participants || participants.length === 0) {
            await sock.sendMessage(chatId, { text: 'No participants found in the group.' });
            return;
        }

        // Create message with each member on a new line
        let messageText = '👋 *𝙷𝚎𝚕𝚕𝚘 𝙴𝚟𝚎𝚛𝚢𝚘𝚗𝚎:*\n\n';
        participants.forEach(participant => {
            messageText += `@${participant.id.split('@')[0]}\n`; // Add \n for new line
        });

        // Send message with mentions
        await sock.sendMessage(chatId, {
            text: messageText,
            mentions: participants.map(p => p.id)
        });

    } catch (error) {
        console.error('Error in tagall command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to tag all members.' });
    }
}

module.exports = tagAllCommand;  // Export directly
