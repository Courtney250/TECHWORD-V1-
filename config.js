const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "XHYPHER:~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQVBOdVVDdDBmWDVvY0pNRmlKeFp0c1FIaEEwc0tnM0FpS2RZalByYmZIQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRGN5djJLK2xRUU8xenpTSE9pSENXK1lmcSt2b0JNWFoxOERvenZxV2hqWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLT3dJdU5lTnllS3BGZ2lYMDNuNFVBWWs3bEw1UTBpK09kR0wxbEpTUWtjPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ4MUp1NXU1Q1FNWFgzYWhucDhuQlFUTUNDSlhHODlTdEF2SFdzYzdaVjJnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InFFVmw1RXJiWkNtZVRRYkFzeVp4ZzlBbFVCQnRoWlBPNVMzVE5EUlZYMEE9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjVtYUE0NzBEV1hOOXVUeVdkcTlCenhGQVNhWHdpdVBhM2ZFUmlFTHdGeEU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibUx6V2hOOFJhU0tKd2NqSXRHVm1FbEtXS3JvM3R5dXhaMitGSUNDMUgzcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiM05lUzhOZXhwQ3ZTWVVhUkR2dTlnc0lQRXZ6dlQ5M1NaeGpHa3hUOHlCST0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkRjYXVRWE9iSVVaT0J5RDN3MzZpSWJBL2ZwTys1dkttMHYvbytBcjZsS0sxcGVEcFROSHdjVVFISEFrRFFWTXhHcTRnT2Qra0Mwbkx2MnBPamhsRmpRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjE3LCJhZHZTZWNyZXRLZXkiOiJHN1RnanVQcjJoS2ZvQzRoT2ttZkExMTJTdUp6TkdUWkZ4cU1zWW95UGRzPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6ODEzLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6ODEzLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IlhIWVBIRVJYIiwibWUiOnsiaWQiOiIyNTQxMDExNTA3NDg6MkBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJDb3VydG5leSIsImxpZCI6IjE2Mzg4Mzc3MTgwMTg1MzoyQGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS200d2VFRUVOejZsY3dHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiQmNOKzl5d2Vma21USWdHU2ZjTmhLbXlZN1l4T0pWVnBFWXRNcVJ4b0NSTT0iLCJhY2NvdW50U2lnbmF0dXJlIjoibVRGb2g0S29SVU82MTQ5a296dXpvWE1taTU5R3dlVElLVXB5ZEs5cE96dDlOSm0vVDZOYjJvR0d2SGc4bVBRdXZITkhLK3ZQanJDWkFwZnhXMEIxQWc9PSIsImRldmljZVNpZ25hdHVyZSI6ImZXWnEvUXo2c3pKNk9xMUVvOUUzUENidXRaVWFiWGk0TVExWkN2cVQ1NFI3NGtPbzlpbkhEV2lmcExjNnk4UDRMUlZGYVFuNzRlK3dnRVRXRitKbGdRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0MTAxMTUwNzQ4OjJAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCUVhEZnZjc0huNUpreUlCa24zRFlTcHNtTzJNVGlWVmFSR0xUS2tjYUFrVCJ9fV0sInBsYXRmb3JtIjoic21iYSIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0FVSUNBZ0MifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzcwMzU2MDc2LCJsYXN0UHJvcEhhc2giOiJQV2s1QiIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBR2x2In0=",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
// make true if you want auto reply on status 
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY KHAN-MD 🤍*",
// set the auto reply massage on status reply  
PREFIX: process.env.PREFIX || ".",
// add your prifix for bot   
BOT_NAME: process.env.BOT_NAME || "KHAN-MD",
// add bot namw here for menu
STICKER_NAME: process.env.STICKER_NAME || "KHAN-MD",
// type sticker pack name 
CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
// make this true for custum emoji react    
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// chose custom react emojis by yourself 
DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "92342758XXXX",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "Jᴀᴡᴀᴅ TᴇᴄʜX",
// add bot owner name
DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX*",
// add bot owner name    
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/149k8x.jpg",
// add img for alive msg
LIVE_MSG: process.env.LIVE_MSG || "> Zinda Hun Yar *KHAN-MD*⚡",
// add alive msg here 
READ_MESSAGE: process.env.READ_MESSAGE || "false",
// Turn true or false for automatic read msgs
AUTO_REACT: process.env.AUTO_REACT || "false",
// make this true or false for auto react on all msgs
ANTI_BAD: process.env.ANTI_BAD || "false",
// false or true for anti bad words  
MODE: process.env.MODE || "public",
// make bot public-private-inbox-group 
ANTI_LINK: process.env.ANTI_LINK || "true",
// make anti link true,false for groups 
AUTO_VOICE: process.env.AUTO_VOICE || "false",
// make true for send automatic voices
AUTO_STICKER: process.env.AUTO_STICKER || "false",
// make true for automatic stickers 
AUTO_REPLY: process.env.AUTO_REPLY || "false",
// make true or false automatic text reply 
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
// maks true for always online 
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
// make false if want private mod
AUTO_TYPING: process.env.AUTO_TYPING || "false",
// true for automatic show typing   
READ_CMD: process.env.READ_CMD || "false",
// true if want mark commands as read 
DEV: process.env.DEV || "923146190772",
//replace with your whatsapp number        
ANTI_VV: process.env.ANTI_VV || "true",
// true for anti once view 
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "log", 
// change it to 'same' if you want to resend deleted message in same chat 
AUTO_RECORDING: process.env.AUTO_RECORDING || "false"
// make it true for auto recoding 
};
