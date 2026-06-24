const fs = require('fs');

function readJsonSafe(path, fallback) {
    try {
        const txt = fs.readFileSync(path, 'utf8');
        return JSON.parse(txt);
    } catch (_) {
        return fallback;
    }
}

const isOwnerOrSudo = require('../lib/isOwner');

async function settingsCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        
        if (!message.key.fromMe && !isOwner) {
            await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!' }, { quoted: message });
            return;
        }

        const isGroup = chatId.endsWith('@g.us');
        const dataDir = './data';

        const mode = readJsonSafe(`${dataDir}/messageCount.json`, { isPublic: true });
        const autoStatus = readJsonSafe(`${dataDir}/autoStatus.json`, { enabled: false });
        const autoread = readJsonSafe(`${dataDir}/autoread.json`, { enabled: false });
        const autotyping = readJsonSafe(`${dataDir}/autotyping.json`, { enabled: false });
        const pmblocker = readJsonSafe(`${dataDir}/pmblocker.json`, { enabled: false });
        const anticall = readJsonSafe(`${dataDir}/anticall.json`, { enabled: false });
        const userGroupData = readJsonSafe(`${dataDir}/userGroupData.json`, {
            antilink: {}, antibadword: {}, welcome: {}, goodbye: {}, chatbot: {}, antitag: {}
        });
        const autoReaction = Boolean(userGroupData.autoReaction);

        // Per-group features
        const groupId = isGroup ? chatId : null;
        const antilinkOn = groupId ? Boolean(userGroupData.antilink && userGroupData.antilink[groupId]) : false;
        const antibadwordOn = groupId ? Boolean(userGroupData.antibadword && userGroupData.antibadword[groupId]) : false;
        const welcomeOn = groupId ? Boolean(userGroupData.welcome && userGroupData.welcome[groupId]) : false;
        const goodbyeOn = groupId ? Boolean(userGroupData.goodbye && userGroupData.goodbye[groupId]) : false;
        const chatbotOn = groupId ? Boolean(userGroupData.chatbot && userGroupData.chatbot[groupId]) : false;
        const antitagCfg = groupId ? (userGroupData.antitag && userGroupData.antitag[groupId]) : null;

        const lines = [];
        lines.push('*𝙱𝙾𝚃 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂*');
        𝚕𝚒𝚗𝚎𝚜.𝚙𝚞𝚜𝚑('');
        𝚕𝚒𝚗𝚎𝚜.𝚙𝚞𝚜𝚑(`• 𝙼𝚘𝚍𝚎: ${𝚖𝚘𝚍𝚎.𝚒𝚜𝙿𝚞𝚋𝚕𝚒𝚌 ? '𝙿𝚞𝚋𝚕𝚒𝚌' : '𝙿𝚛𝚒𝚟𝚊𝚝𝚎'}`);
        𝚕𝚒𝚗𝚎𝚜.𝚙𝚞𝚜𝚑(`• 𝙰𝚞𝚝𝚘 𝚂𝚝𝚊𝚝𝚞𝚜: ${𝚊𝚞𝚝𝚘𝚂𝚝𝚊𝚝𝚞𝚜.𝚎𝚗𝚊𝚋𝚕𝚎𝚍 ? '𝙾𝙽' : '𝙾𝙵𝙵'}`);
        𝚕𝚒𝚗𝚎𝚜.𝚙𝚞𝚜𝚑(`• 𝙰𝚞𝚝𝚘𝚛𝚎𝚊𝚍: ${𝚊𝚞𝚝𝚘𝚛𝚎𝚊𝚍.𝚎𝚗𝚊𝚋𝚕𝚎𝚍 ? '𝙾𝙽' : '𝙾𝙵𝙵'}`);
        𝚕𝚒𝚗𝚎𝚜.𝚙𝚞𝚜𝚑(`• 𝙰𝚞𝚝𝚘𝚝𝚢𝚙𝚒𝚗𝚐: ${𝚊𝚞𝚝𝚘𝚝𝚢𝚙𝚒𝚗𝚐.𝚎𝚗𝚊𝚋𝚕𝚎𝚍 ? '𝙾𝙽' : '𝙾𝙵𝙵'}`);
        𝚕𝚒𝚗𝚎𝚜.𝚙𝚞𝚜𝚑(`• 𝙿𝙼 𝙱𝚕𝚘𝚌𝚔𝚎𝚛: ${𝚙𝚖𝚋𝚕𝚘𝚌𝚔𝚎𝚛.𝚎𝚗𝚊𝚋𝚕𝚎𝚍 ? '𝙾𝙽' : '𝙾𝙵𝙵'}`);
        𝚕𝚒𝚗𝚎𝚜.𝚙𝚞𝚜𝚑(`• 𝙰𝚗𝚝𝚒𝚌𝚊𝚕𝚕: ${𝚊𝚗𝚝𝚒𝚌𝚊𝚕𝚕.𝚎𝚗𝚊𝚋𝚕𝚎𝚍 ? '𝙾𝙽' : '𝙾𝙵𝙵'}`);
        𝚕𝚒𝚗𝚎𝚜.𝚙𝚞𝚜𝚑(`• 𝙰𝚞𝚝𝚘 𝚁𝚎𝚊𝚌𝚝𝚒𝚘𝚗: ${𝚊𝚞𝚝𝚘𝚁𝚎𝚊𝚌𝚝𝚒𝚘𝚗 ? '𝙾𝙽' : '𝙾𝙵𝙵'}`);
        if (groupId) {
            lines.push('');
            lines.push(`Group: ${groupId}`);
            if (antilinkOn) {
                const al = userGroupData.antilink[groupId];
                lines.push(`• Antilink: ON (action: ${al.action || 'delete'})`);
            } else {
                lines.push('• Antilink: OFF');
            }
            if (antibadwordOn) {
                const ab = userGroupData.antibadword[groupId];
                lines.push(`• Antibadword: ON (action: ${ab.action || 'delete'})`);
            } else {
                lines.push('• Antibadword: OFF');
            }
            lines.push(`• Welcome: ${welcomeOn ? 'ON' : 'OFF'}`);
            lines.push(`• Goodbye: ${goodbyeOn ? 'ON' : 'OFF'}`);
            lines.push(`• Chatbot: ${chatbotOn ? 'ON' : 'OFF'}`);
            if (antitagCfg && antitagCfg.enabled) {
                lines.push(`• Antitag: ON (action: ${antitagCfg.action || 'delete'})`);
            } else {
                lines.push('• Antitag: OFF');
            }
        } else {
            lines.push('');
            lines.push('Note: Per-group settings will be shown when used inside a group.');
        }

        await sock.sendMessage(chatId, { text: lines.join('\n') }, { quoted: message });
    } catch (error) {
        console.error('Error in settings command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to read settings.' }, { quoted: message });
    }
}

module.exports = settingsCommand;


