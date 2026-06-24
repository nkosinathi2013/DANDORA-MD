const isAdmin = require('../lib/isAdmin');

async function muteCommand(sock, chatId, senderId, message, durationInMinutes) {
    

    const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);
    if (!isBotAdmin) {
        await sock.sendMessage(chatId, { text: '𝙿𝚕𝚎𝚊𝚜𝚎 𝚖𝚊𝚔𝚎 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚏𝚒𝚛𝚜𝚝.' }, { quoted: message });
        return;
    }

    if (!isSenderAdmin) {
        await sock.sendMessage(chatId, { text: '𝙾𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚎 𝚖𝚞𝚝𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍. }, { quoted: message });
        return;
    }

    try {
        // Mute the group
        await sock.groupSettingUpdate(chatId, 'announcement');
        
        if (durationInMinutes !== undefined && durationInMinutes > 0) {
            const durationInMilliseconds = durationInMinutes * 60 * 1000;
            await sock.sendMessage(chatId, { text: `𝚃𝚑𝚎 𝚐𝚛𝚘𝚞𝚙 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚖𝚞𝚝𝚎𝚍 𝚏𝚘𝚛  ${durationInMinutes} minutes.` }, { quoted: message });
            
            // Set timeout to unmute after duration
            setTimeout(async () => {
                try {
                    await sock.groupSettingUpdate(chatId, 'not_announcement');
                    await sock.sendMessage(chatId, { text: '𝚃𝚑𝚎 𝚐𝚛𝚘𝚞𝚙 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚞𝚗𝚖𝚞𝚝𝚎𝚍.' });
                } catch (unmuteError) {
                    console.error('Error unmuting group:', unmuteError);
                }
            }, durationInMilliseconds);
        } else {
            await sock.sendMessage(chatId, { text: '𝚃𝚑𝚎 𝚐𝚛𝚘𝚞𝚙 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚖𝚞𝚝𝚎𝚍 𝚏𝚘𝚛 .' }, { quoted: message });
        }
    } catch (error) {
        console.error('Error muting/unmuting the group:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while muting/unmuting the group. Please try again.' }, { quoted: message });
    }
}

module.exports = muteCommand;
