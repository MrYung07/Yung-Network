const { SlashCommandBuilder } = require('discord.js');
const { checkLive } = require('./twitchnotif');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testlive')
    .setDescription('Test live Twitch'),

async execute(interaction) {

  console.log("🚀 testlive eseguito");

  // 🔒 blocco totale doppie risposte
  if (interaction.replied || interaction.deferred) {
    console.log("⚠️ Interaction già usata");
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    await checkLive(interaction.client, true);

    await interaction.editReply({
      content: '✅ Test live inviato!'
    });

  } catch (err) {
    console.error(err);

    if (!interaction.replied) {
      await interaction.editReply({
        content: '❌ Errore durante il test live'
      });
    }
  }
}
};