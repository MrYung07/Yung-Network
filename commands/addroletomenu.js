const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'roles.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addroletomenu')
    .setDescription('Aggiungi un ruolo al pannello bottoni')
    .addRoleOption(opt =>
      opt.setName('ruolo')
        .setDescription('Ruolo da aggiungere')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('emoji')
        .setDescription('Emoji del bottone')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    try {
      const role = interaction.options.getRole('ruolo');
      const emoji = interaction.options.getString('emoji') || null;

      // 🔹 Controlli base
      if (!role) {
        return interaction.reply({ content: '⚠ Ruolo non valido!', ephemeral: true });
      }

      if (role.managed) {
        return interaction.reply({ content: '⚠ Non puoi usare ruoli bot!', ephemeral: true });
      }

      if (role.position >= interaction.guild.members.me.roles.highest.position) {
        return interaction.reply({ content: '⚠ Questo ruolo è sopra il bot!', ephemeral: true });
      }

      // 🔹 Legge JSON
      let data = {};
      if (fs.existsSync(configPath)) {
        try {
          data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch {
          data = {};
        }
      }

      if (!data[interaction.guild.id]) {
        data[interaction.guild.id] = [];
      }

      // 🔹 Evita duplicati
      if (data[interaction.guild.id].some(r => r.id === role.id)) {
        return interaction.reply({ content: '⚠ Ruolo già presente nel menu!', ephemeral: true });
      }

      // 🔹 Aggiunge ruolo
      data[interaction.guild.id].push({
        id: role.id,
        name: role.name,
        emoji: emoji
      });

      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));

      await interaction.reply({
        content: `✅ Ruolo **${role.name}** aggiunto al pannello!`,
        ephemeral: true
      });

    } catch (err) {
      console.error('Errore addroletomenu:', err);

      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Errore durante l\'aggiunta del ruolo.',
          ephemeral: true
        });
      }
    }
  }
};