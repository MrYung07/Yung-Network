const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

const STREAMER = 'mryung07'; // es: yungt
const CHANNEL_ID = '1476526624085250049';
const ROLE_ID = '1476526581810728970';

let accessToken = null;
let lastLive = false;

// 🔹 TOKEN
async function getAccessToken() {
  try {
    const res = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
      params: {
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    });

    accessToken = res.data.access_token;
    console.log("✅ Token Twitch OK");
  } catch (err) {
    console.error("❌ ERRORE TOKEN:", err.response?.data || err.message);
  }
}

// 🔹 CHECK LIVE
async function checkLive(client, force = false) {
  console.log("🔍 Controllo live...");

  if (!accessToken) await getAccessToken();
  if (!accessToken) return console.log("❌ Nessun token");

  try {
    const res = await axios.get(`https://api.twitch.tv/helix/streams`, {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        user_login: STREAMER
      }
    });

    console.log("📡 RISPOSTA TWITCH:", res.data);

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) return console.log("❌ Canale non trovato");

    // 🔥 SE OFFLINE
    if (res.data.data.length === 0) {
      console.log("⚫ Offline");
      lastLive = false;

      if (!force) return;
    }

    // 🔥 PRENDI DATI (anche fake se test)
    const stream = res.data.data[0] || {
      user_name: STREAMER,
      title: "TEST LIVE",
      game_name: "Just Chatting",
      viewer_count: 999,
      thumbnail_url: "https://static-cdn.jtvnw.net/previews-ttv/live_user_" + STREAMER + "-1280x720.jpg"
    };

    // 🔥 INVIO
    if (!lastLive || force) {
      lastLive = true;

      const embed = new EmbedBuilder()
        .setTitle(stream.title)
        .setURL(`https://twitch.tv/${STREAMER}`)
        .setDescription('Fate un salto')
        .addFields(
          { name: '🎮 Gioco', value: stream.game_name, inline: true },
          { name: '👀 Viewers', value: stream.viewer_count.toString(), inline: true }
        )
        .setImage(stream.thumbnail_url.replace('{width}', '1280').replace('{height}', '720'))
        .setColor('Purple')
        .setTimestamp();

      await channel.send({
        content: `<:twitch:1488681906101944330><@&${ROLE_ID}> 🚨 SONO IN LIVE ORA!`,
        embeds: [embed]
      });

      console.log("✅ NOTIF INVIATA");
    }

  } catch (err) {
    console.error("❌ ERRORE TWITCH:", err.response?.data || err.message);
  }
}

// 🔁 LOOP
function startTwitchNotifier(client) {
  console.log("🚀 Twitch notifier avviato");

  setInterval(() => {
    checkLive(client);
  }, 60000);
}

module.exports = { startTwitchNotifier, checkLive };