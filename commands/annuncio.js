const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('annuncio')
    .setDescription('Invia un annuncio in un canale')
    .addStringOption(option =>
      option.setName('titolo')
       .setDescription('titolo dell annucnio')
       .setRequired(true))
    .addChannelOption(option =>
      option.setName('canale')
        .setDescription('Seleziona il canale dove inviare l’annuncio')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .addStringOption(option =>
      option.setName('messaggio')
        .setDescription('Scrivi il testo dell’annuncio')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '❌ Non hai i permessi per fare annunci!', flags: 64 });
    }
    const titolo =interaction.options.getString('titolo');
    const canale = interaction.options.getChannel('canale');
    const messaggio = interaction.options.getString('messaggio');

    const embed = new EmbedBuilder()
      .setTitle(titolo)
      .setDescription(messaggio)
      .setColor('Purple')
      .setFooter({ text: `Annuncio inviato da ${interaction.user.tag}` })
      .setTimestamp();

    await canale.send({ embeds: [embed] });

    // Messaggio privato di conferma all’utente
    await interaction.reply({ content: `✅ Annuncio inviato in ${canale}`, flags: 64 });
  }
};