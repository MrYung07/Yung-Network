const { Client, GatewayIntentBits, Collection, PermissionsBitField, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data) client.commands.set(command.data.name, command);
}

// TICKET SYSTEM
const ticketsPerGuild = new Map();

// LOG CANALE RUOLI
const LOG_CHANNEL_ID = "1476526685380808755";

const { startTwitchNotifier } = require('./commands/twitchnotif');

client.once('clientReady', () => {
  console.log(`✅ Bot online come ${client.user.tag}`);
  startTwitchNotifier(client);
  client.user.setPresence({
    activities: [{ name: '/help | Yung Network🤖', type: 3 }],
    status: 'online'
  });
});

const guildConfig = {
  "1476360751668138105": { 
    CATEGORY_ID: "1451673471858901174", 
    STAFF_ROLE_ID: "1476526536327954443" 
  }
};

client.on('interactionCreate', async interaction => {
  if (!interaction.guild) return;

  try {

    // ======================
    // 🔹 SLASH COMMAND
    // ======================
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      await command.execute(interaction);
    }

    // ======================
    // 🔹 BUTTON
    // ======================
    else if (interaction.isButton()) {

      const userId = interaction.user.id;

      // 🔸 ANTI-SPAM
      if (!global.cooldown) global.cooldown = new Set();
      if (global.cooldown.has(userId)) {
        return interaction.reply({ content: '⏳ Aspetta!', ephemeral: true }).catch(() => {});
      }
      global.cooldown.add(userId);
      setTimeout(() => global.cooldown.delete(userId), 1500);

      // ======================
      // 🎭 RUOLI BUTTON
      // ======================
      if (interaction.customId.startsWith('role_')) {

        const rolesPath = path.join(__dirname, 'roles.json');
        const data = fs.existsSync(rolesPath)
          ? JSON.parse(fs.readFileSync(rolesPath, 'utf8'))
          : {};

        const guildRoles = data[interaction.guild.id];
        if (!guildRoles) return;

        const roleId = interaction.customId.replace('role_', '');
        const role = interaction.guild.roles.cache.get(roleId);
        const member = interaction.member;

        if (!role) {
          return interaction.reply({ content: '⚠ Ruolo non trovato.', ephemeral: true });
        }

        if (role.position >= interaction.guild.members.me.roles.highest.position) {
          return interaction.reply({ content: '⚠ Ruolo troppo alto.', ephemeral: true });
        }

        let action = '';

        if (member.roles.cache.has(roleId)) {
          await member.roles.remove(roleId);
          action = 'rimosso';
        } else {
          await member.roles.add(roleId);
          action = 'aggiunto';
        }

        await interaction.reply({
          embeds: [{
            color: action === 'aggiunto' ? 0x00ff00 : 0xff0000,
            description: `${action === 'aggiunto' ? '✅' : '❌'} Ruolo **${role.name}** ${action}`
          }],
          ephemeral: true
        });
      }

      // ======================
      // 🎫 CREA TICKET
      // ======================
      else if (interaction.customId.startsWith('create_ticket_')) {

        const parts = interaction.customId.split('_');
        const categoryId = parts[2];
        const staffRoleId = parts[3];

        let tickets = ticketsPerGuild.get(interaction.guild.id);
        if (!tickets) {
          tickets = new Map();
          ticketsPerGuild.set(interaction.guild.id, tickets);
        }

        if (tickets.has(interaction.user.id)) {
          return interaction.reply({ content: "Hai già un ticket aperto!", ephemeral: true });
        }

        const channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, ''),
          type: ChannelType.GuildText,
          parent: categoryId,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: ['ViewChannel'] },
            { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] },
            { id: staffRoleId, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }
          ]
        });

        tickets.set(interaction.user.id, channel.id);

        const closeBtn = new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Chiudi Ticket')
          .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(closeBtn);

        const embed = new EmbedBuilder()
          .setTitle('🎫 Ticket')
          .setDescription('Aspetta che uno Staff ti risponderà.')
          .setColor('Purple');

        await channel.send({
          content: `${interaction.user}`,
          embeds: [embed],
          components: [row]
        });

        await interaction.reply({
          content: `✅ Ticket creato: ${channel}`,
          ephemeral: true
        });
      }

      // ======================
      // 🔒 CHIUDI TICKET
      // ======================
      else if (interaction.customId === 'close_ticket') {

        const tickets = ticketsPerGuild.get(interaction.guild.id);
        if (!tickets) return;

        const userId = [...tickets.entries()]
          .find(([_, id]) => id === interaction.channel.id)?.[0];

        if (userId) tickets.delete(userId);

        await interaction.reply({
          content: '🔒 Chiusura ticket in 3 secondi...',
          ephemeral: true
        });

        setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
      }
    }

    // ======================
    // 📩 MODAL
    // ======================
    else if (interaction.isModalSubmit()) {

      if (interaction.customId === 'partner_modal') {

        const nome = interaction.fields.getTextInputValue('nome');
        const menzione = interaction.fields.getTextInputValue('menzione');
        const bio = interaction.fields.getTextInputValue('bio');
        const invito = interaction.fields.getTextInputValue('invito');

        const embed = new EmbedBuilder()
          .setTitle(`🤝 Partner con ${nome}`)
          .setDescription(
            `📢 **Partner Richiesta da:** ${menzione}\n\n` +
            `📝 **Descrizione:**\n${bio}\n\n` +
            `🔗 **Invito:** ${invito}\n\n` +
            `🤝 **Fatta da:** ${interaction.user}`
          )
          .setColor('Purple')
          .setTimestamp();

        await interaction.reply({
          content: '✅ Partner creato!',
          ephemeral: true
        });

        await interaction.channel.send({ embeds: [embed] });
      }
    }

  } catch (err) {
    console.error("❌ ERRORE INTERACTION:", err);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: '⚠ Errore interno!',
        ephemeral: true
      }).catch(() => {});
    }
  }
});

// Welcome DM con URL valido
client.on('guildMemberAdd', async member => {
  const config = JSON.parse(fs.readFileSync('./welcomeConfig.json'));
  const guildConfig = config[member.guild.id];
  if (!guildConfig) return;

  const channel = member.guild.channels.cache.get(guildConfig.channelId);
  if (!channel) return;

  const background = "https://image2url.com/r2/default/images/1775820823634-2e86d04d-924b-41f8-87b4-be51d8f5bf7c.png"; // URL valido
  const avatar = member.user.displayAvatarURL({ extension: 'png', size: 512 });
  const image = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent(background)}&avatar=${encodeURIComponent(avatar)}&text1=${encodeURIComponent(member.user.username)}&text2=${encodeURIComponent("Benvenuto!")}&text3=${encodeURIComponent(`Membri: ${member.guild.memberCount}`)}`;

  const embed = new EmbedBuilder()
    .setTitle('🎉 Benvenuto/a nella community! 🎉')
    .setDescription(`Ciao ${member}! 👋
Siamo felici di averti qui! Questo server è il posto giusto per chi ama seguire streamer e content creator su Twitch e YouTube, condividere momenti epici, e fare nuove amicizie nella community.

**💬 Cosa puoi fare qui:**

Parlare dei tuoi streamer e creator preferiti

Condividere clip, video e momenti divertenti

Partecipare a eventi e giveaway della community

Fare nuove amicizie con persone che condividono la tua passione

**📌 Consigli utili:**

Presentati nel canale <#1486133697651409148>

Dai un’occhiata alle regole in <#1476526621539176602> per mantenere il server sicuro e divertente per tutti

Per poter accedere a tutti i canali e unirti alla community, devi completare la verifica. <#1476526613431717950>

Ancora benvenuto/a! Siamo entusiasti di averti con noi! 🌟`)
    .setImage(image)
    .setColor('Purple');

  await channel.send({ embeds: [embed] });
  try { await member.send({ embeds: [embed] }); } catch(err){ console.log(`Non posso inviare DM a ${member.user.tag}`);}
});

client.login(process.env.TOKEN);