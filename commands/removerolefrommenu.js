const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'roles.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerolefrommenu')
    .setDescription('Rimuovi un ruolo dal pannello')
    .addRoleOption(opt =>
      opt.setName('ruolo')
        .setDescription('Ruolo da rimuovere')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    try {
      const role = interaction.options.getRole('ruolo');

      let data = fs.existsSync(configPath)
        ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
        : {};

      if (!data[interaction.guild.id]) {
        return interaction.reply({ content: '⚠ Nessun ruolo configurato!', ephemeral: true });
      }

      const index = data[interaction.guild.id].findIndex(r => r.id === role.id);

      if (index === -1) {
        return interaction.reply({ content: '⚠ Ruolo non presente nel pannello!', ephemeral: true });
      }

      data[interaction.guild.id].splice(index, 1);
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));

      await interaction.reply({
        content: `❌ Ruolo **${role.name}** rimosso dal pannello!`,
        ephemeral: true
      });

    } catch (err) {
      console.error(err);
      if (!interaction.replied) {
        await interaction.reply({ content: 'Errore!', ephemeral: true });
      }
    }
  }
};