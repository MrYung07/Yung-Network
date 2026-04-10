const { SlashCommandBuilder } = require('discord.js');
const { checkLive } = require('./twitchnotif');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testlive')
    .setDescription('Test live Twitch'),

  async execute(interaction) {

    await interaction.deferReply({ ephemeral: true });

    await checkLive(interaction.client, true); // 👈 ORA È DENTRO async

    await interaction.editReply({ content: '✅ Test live inviato!' });

  }
};