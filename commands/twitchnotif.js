const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

// CONFIG
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

const STREAMER = 'mryung07';
const CHANNEL_ID = '1476526624085250049';
const ROLE_ID = '1476526581810728970'; // 👈 ruolo da pingare

let accessToken = null;
let lastLive = false;

// 🔹 TOKEN
async function getAccessToken() {
  const res = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
    params: {
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }
  });

  accessToken = res.data.access_token;
}

// 🔹 CHECK LIVE
async function checkLive(client, force = false) {
  if (!accessToken) await getAccessToken();

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

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) return;

    if (res.data.data.length > 0) {
      const stream = res.data.data[0];

      if (!lastLive || force) {
        lastLive = true;

        const embed = new EmbedBuilder()
          .setTitle(`🔴 ${stream.user_name} è in LIVE!`)
          .setURL(`https://twitch.tv/${STREAMER}`)
          .setDescription(stream.title)
          .addFields(
            { name: '🎮 Gioco', value: stream.game_name || 'Nessuno', inline: true },
            { name: '👀 Viewers', value: stream.viewer_count.toString(), inline: true }
          )
          .setImage(stream.thumbnail_url.replace('{width}', '1280').replace('{height}', '720'))
          .setColor('Purple')
          .setTimestamp();

        channel.send({
          content: `<@&${ROLE_ID}> 🚨 **LIVE ORA!** https://twitch.tv/${STREAMER}`, // 👈 PING
          embeds: [embed]
        });
      }

    } else {
      lastLive = false;
    }

  } catch (err) {
    console.error('Errore Twitch:', err.message);
  }
}

// 🔹 LOOP
function startTwitchNotifier(client) {
  setInterval(() => {
    checkLive(client);
  }, 60000); // ogni 60 sec
}

module.exports = { startTwitchNotifier, checkLive };