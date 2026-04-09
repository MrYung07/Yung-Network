const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Crea un pannello ticket personalizzato')
    .addStringOption(option =>
      option.setName('titolo')
        .setDescription('Titolo del pannello')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('descrizione')
        .setDescription('Descrizione')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('emoji')
        .setDescription('Emoji bottone (es: 🎫)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('bottone')
        .setDescription('Testo bottone')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('categoria')
        .setDescription('Categoria dove creare i ticket')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('staff')
        .setDescription('Ruolo staff')
        .setRequired(true)),

  async execute(interaction) {

    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Non hai permessi!', ephemeral: true });
    }

    const titolo = interaction.options.getString('titolo');
    const descrizione = interaction.options.getString('descrizione');
    const emoji = interaction.options.getString('emoji');
    const testoBottone = interaction.options.getString('bottone');
    const categoria = interaction.options.getChannel('categoria');
    const staffRole = interaction.options.getRole('staff');

    const embed = new EmbedBuilder()
      .setTitle(titolo)
      .setDescription(descrizione)
      .setColor('Purple');

    const button = new ButtonBuilder()
      .setCustomId(`create_ticket_${categoria.id}_${staffRole.id}`)
      .setLabel(testoBottone)
      .setStyle(ButtonStyle.Primary)
      .setEmoji(emoji);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ content: '✅ Pannello creato!', ephemeral: true });

    await interaction.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};