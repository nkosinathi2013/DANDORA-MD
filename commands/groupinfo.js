async function groupInfoCommand(sock, chatId, msg) {
    try {
        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        
        // Get group profile picture
        let pp;
        try {
            pp = await sock.profilePictureUrl(chatId, 'image');
        } catch {
            pp = 'https://i.imgur.com/2wzGhpF.jpeg'; // Default image
        }

        // Get admins from participants
        const participants = groupMetadata.participants;
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
        
        // Get group owner
        const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || chatId.split('-')[0] + '@s.whatsapp.net';

        // Create info text
        const text = `
┌──「 *𝙸𝙽𝙵𝙾 𝙶𝚁𝙾𝚄𝙿* 」
▢ *💕𝙸𝙳:*
   • ${groupMetadata.id}
▢ *🫁𝙽𝙰𝙼𝙴* : 
• ${groupMetadata.subject}
▢ *👥𝙼𝚎𝚖𝚋𝚎𝚛𝚜* :
• ${participants.length}
▢ *🥵𝙶𝚛𝚘𝚞𝚙 𝙾𝚠𝚗𝚎𝚛:*
• @${owner.split('@')[0]}
▢ *🕵🏻‍♂️𝙰𝚍𝚖𝚒𝚗𝚜:*
${listAdmin}

▢ *📌𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗* :
   • ${groupMetadata.desc?.toString() || 'No description'}
`.trim();

        // Send the message with image and mentions
        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: text,
            mentions: [...groupAdmins.map(v => v.id), owner]
        });

    } catch (error) {
        console.error('Error in groupinfo command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to get group info!' });
    }
}

module.exports = groupInfoCommand; 