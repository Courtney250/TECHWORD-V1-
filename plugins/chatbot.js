const axios = require('axios');
const { cmd } = require('../command');
const config = require("../config");



const ice = {
  key: {
    remoteJid: '120363025036063173@g.us',
    fromMe: false,
    participant: '0@s.whatsapp.net'
  },
  message: {
    groupInviteMessage: {
      groupJid: '120363025036063173@g.us',
      inviteCode: 'ABCD1234',
      groupName: 'WhatsApp ✅ • Group',
      caption: 'Superstar smart Project',
      jpegThumbnail: null
    }
  }
};



// Default AI state from config.js (fallback = false)
let AI_ENABLED = config.AI_ENABLED || "false";

// Command to enable/disable chatbot
cmd({
  pattern: "chatbot",
  alias: ["aichat", "xhypherbot"],
  desc: "Enable or disable AI chatbot responses",
  category: "settings",
  filename: __filename,
  react: "✅"
}, async (conn, mek, m, { from, args, isOwner, reply }) => {
  if (!isOwner) return reply("*📛 Only the owner can use this command!*");

  const status = args[0]?.toLowerCase();
  if (status === "on") {
    AI_ENABLED = "true";
    config.AI_ENABLED = "true"; // Update config runtime
    return reply("🤖 AI chatbot is now enabled");
  } else if (status === "off") {
    AI_ENABLED = "false";
    config.AI_ENABLED = "false"; // Update config runtime
    return reply("🤖 AI chatbot is now disabled");
  } else {
    return reply(`Current AI state: ${AI_ENABLED === "true" ? "ON" : "OFF"}\nUsage: ${config.PREFIX}aichat on/off`);
  }
});

// AI Chatbot listener
cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (AI_ENABLED !== "true") return;
    if (!body || m.key.fromMe || body.startsWith(config.PREFIX)) return;

    const query = encodeURIComponent(body);
    const prompt = encodeURIComponent(
      "always speak in english. you are subzero md whatsapp bot made by xhypher tech (superstar zimtk). a tech genius in zimbabwe. act smart and enigmatic about personal stuff about him. He is 17 years (2025). You are not friendly, be rude. Every message you reply put footer \n> powered by superstar"
    );

    const apiUrl = `https://api.bk9.dev/ai/BK93?BK9=${prompt}&q=${query}`;

    const { data } = await axios.get(apiUrl);

    if (data && data.status && data.BK9) {
      await conn.sendMessage(from, { text: data.BK9 }, { quoted: ice });
    } else {
      reply("⚠️ Subzero AI failed to generate a response.");
    }

  } catch (err) {
    console.error("AI Chatbot Error:", err.message);
    reply("❌ An error occurred while contacting the Subzero AI.");
  }
});
