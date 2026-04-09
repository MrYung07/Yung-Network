const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testlive')
    .setDescription('Testa la notifica Twitch'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('🔴 STREAMER è in LIVE!')
      .setURL('https://twitch.tv/tuonome')
      .setDescription('Questo è un test della live 🚀')
      .addFields(
        { name: '🎮 Gioco', value: 'Just Chatting', inline: true },
        { name: '👀 Viewers', value: '999', inline: true }
      )
      .setColor('Purple')
      .setTimestamp();

    await interaction.reply({
      content: `<@&ID_RUOLO> 🚨 LIVE ORA!`,
      embeds: [embed]
    });

  }
};