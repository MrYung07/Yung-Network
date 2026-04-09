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
  client.user.setPresence({
    activities: [{ name: '/help | Yung Network🎫🤖', type: 3 }],
    status: 'online'
  });
});

const guildConfig = {
  "1476360751668138105": { 
    CATEGORY_ID: "1451673471858901174", 
    STAFF_ROLE_ID: "1476526536327954443" 
  }
};

// ✅ HANDLER UNICO PER INTERACTIONS (SLASH + BUTTON)
client.on('interactionCreate', async interaction => {
  if (!interaction.guild) return;

  // 🔹 SLASH COMMAND
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try { 
      await command.execute(interaction); 
    } catch (err) { 
      console.error(err); 
      if (!interaction.replied) await interaction.reply({ content: '⚠ Errore interno!', ephemeral: true }).catch(() => {});
    }
  }
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

const rolesPath = path.join(__dirname, 'roles.json'); 
const cooldown = new Set();

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const userId = interaction.user.id;

  // Anti-spam
  if (cooldown.has(userId)) {
    return interaction.reply({ content: '⏳ Aspetta!', ephemeral: true }).catch(() => {});
  }
  cooldown.add(userId);
  setTimeout(() => cooldown.delete(userId), 1500);

  // Lettura ruoli
  const data = fs.existsSync(rolesPath) ? JSON.parse(fs.readFileSync(rolesPath, 'utf8')) : {};
  const guildRoles = data[interaction.guild.id];
  if (!guildRoles) return;

  // Gestione click su ruolo
  if (interaction.customId.startsWith('role_')) {
    const roleId = interaction.customId.replace('role_', '');
    const role = interaction.guild.roles.cache.get(roleId);
    const member = interaction.member;

    if (!role) return interaction.reply({ content: '⚠ Ruolo non trovato.', ephemeral: true }).catch(() => {});
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: '⚠ Ruolo troppo alto.', ephemeral: true }).catch(() => {});
    }

    let action = '';
    try {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
        action = 'rimosso';
      } else {
        await member.roles.add(roleId);
        action = 'aggiunto';
      }

      // Risposta utente
      if (!interaction.replied) {
        await interaction.reply({
          embeds: [{
            color: action === 'aggiunto' ? 0x00ff00 : 0xff0000,
            description: `${action === 'aggiunto' ? '✅' : '❌'} Ruolo **${role}** e ${action}`
          }],
          ephemeral: true
        }).catch(() => {});
      }

      // Log su canale
      const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
      if (logChannel) {
        logChannel.send({
          embeds: [{
            title: '📜 Log Ruoli',
            color: 0x2f3136,
            description: `👤 Utente: ${interaction.user.tag}\n🎭 Ruolo: ${role}\n📌 Azione: ${action}`,
            timestamp: new Date()
          }]
        }).catch(() => {});
      }

    } catch (err) {
      console.error(err);
      if (!interaction.replied) {
        await interaction.reply({ content: '⚠ Errore, controlla i permessi.', ephemeral: true }).catch(() => {});
      }
    }
  }
});
//ticket
if (interaction.isButton() && interaction.customId.startsWith('create_ticket_')) {

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
  // Bottone chiudi ticket
  if (interaction.isButton() && interaction.customId === 'close_ticket') {
    const tickets = ticketsPerGuild.get(interaction.guild.id);
    if (!tickets) return;
    const userId = [...tickets.entries()].find(([_, id]) => id === interaction.channel.id)?.[0];
    if (userId) tickets.delete(userId);
    await interaction.reply({ content: '🔒 Chiusura ticket in 3 secondi...', ephemeral: true });
    setTimeout(() => interaction.channel.delete(), 3000);
  }
});


// Welcome DM con URL valido
client.on('guildMemberAdd', async member => {
  const config = JSON.parse(fs.readFileSync('./welcomeConfig.json'));
  const guildConfig = config[member.guild.id];
  if (!guildConfig) return;

  const channel = member.guild.channels.cache.get(guildConfig.channelId);
  if (!channel) return;

  const background = "https://image2url.com/r2/default/images/1775508710843-bf954a7d-6af9-458a-935a-b5f2abbb33c3.png"; // URL valido
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