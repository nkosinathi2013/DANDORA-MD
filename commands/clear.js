async function clearCommand(sock, chatId) {
    try {
        const message = await sock.sendMessage(chatId, { text: '𝙲𝚕𝚎𝚊𝚛𝚒𝚗𝚐 𝚋𝚘𝚝 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜' });
        const messageKey = message.key; // Get the key of the message the bot just sent
        
        // Now delete the bot's message
        await sock.sendMessage(chatId, { delete: messageKey });
        
    } catch (error) {
        console.error('Error clearing messages:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while clearing messages.' });
    }
}

module.exports = { clearCommand };
