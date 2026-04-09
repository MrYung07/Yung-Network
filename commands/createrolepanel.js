const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const rolesPath = path.join(__dirname, '../roles.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createrolepanel')
    .setDescription('Crea un pannello ruoli')
    .addStringOption(option => 
      option.setName('titolo')
        .setDescription('Titolo del pannello')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('descrizione')
        .setDescription('Descrizione del pannello')
        .setRequired(true)),

async execute(interaction) {

  await interaction.deferReply({ ephemeral: true }); // 🔥 IMPORTANTISSIMO

  const titolo = interaction.options.getString('titolo');
  const descrizione = interaction.options.getString('descrizione');

  const data = fs.existsSync(rolesPath)
    ? JSON.parse(fs.readFileSync(rolesPath, 'utf8'))
    : {};

  const guildRoles = data[interaction.guild.id];

  if (!guildRoles || guildRoles.length === 0) {
    return interaction.editReply({ content: '⚠ Nessun ruolo configurato.' });
  }

  const rows = [];
  let row = new ActionRowBuilder();

  guildRoles.forEach((r, i) => {
    const btn = new ButtonBuilder()
      .setCustomId(`role_${r.id}`)
      .setLabel(r.name)
      .setEmoji(r.emoji || undefined)
      .setStyle(ButtonStyle.Secondary);

    row.addComponents(btn);

    if ((i + 1) % 5 === 0 || i === guildRoles.length - 1) {
      rows.push(row);
      row = new ActionRowBuilder();
    }
  });

  const embed = new EmbedBuilder()
    .setTitle(titolo)
    .setDescription(descrizione)
    .setColor('Purple');

  await interaction.channel.send({ embeds: [embed], components: rows });

  // ✅ invece di reply
  await interaction.editReply({ content: '✅ Pannello creato!' });
}
};