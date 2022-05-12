var startup = 'prod';

if (process.argv.slice(2)[0]) {
  var option = process.argv.slice(2)[0];

  if (option.toLowerCase() == 'beta') {
    console.log('Using beta token\n============================')
    startup = 'beta';
  } else {
    console.log('Incorrect startup option, using production token\n============================')
  }
} else {
  console.log('Using production token\n============================')
}

const Discord = require(`discord.js`);
const { Client } = require('discord.js');
const client = new Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "GUILD_BANS",
    "GUILD_MESSAGE_TYPING",
    "GUILD_EMOJIS_AND_STICKERS"
  ], partials: [
    "CHANNEL",
    "USER"
  ],
  disableMentions: 'everyone'
});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const fs = require(`fs`);
const config = require(`./config.json`);

var token = config.token_prod;
if (option == 'beta') {
  token = config.token_beta;
}

const { Pool } = require('pg')
const pool = new Pool({
  user: config.dbuser,
  database: config.dbname,
  password: config.dbpass,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
  max: 0
});

const rest = new REST({ version: '9' }).setToken(token);

//global variables
client.emojiPile;
client.timezones = require('./plugins/timezones.json')
client.failedCommands = [];
client.totalCommands = 0;
client.slashCommands = [];
client.aliases = new Map();
client.help = new Map();
client.colors = {
  "bad": "FF4D00",
  "neutral": "FFF200",
  "good": "62FF00"
}
client.isInteraction = false; //default
const countedRecently = new Set();

//message send handler
client.messageHandler = async function m(message, isInteraction, mContent, edit, channel) {
  var reply;
  if (isInteraction) {
    if (edit) {
      reply = await message.editReply(mContent);
    } else {
      reply = await message.reply(mContent);
    }
  } else {
    if (channel) {
      reply = await channel.send(mContent);
    } else {
      reply = await message.channel.send(mContent);
    }
  }
  return reply;
};

//temporary sets - these die when the process does
const deletedMessage = new Set();
const roles = new Set();
const tossedSet = new Set();
const cooldown = new Set();

client.timeCon = function timeCon(timestamp) {
  var date = new Date(timestamp);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();

  var formattedTime = hours + ':' + minutes.substring(-2) + ':' + seconds.substring(-2);

  return formattedTime;
}

//blacklist loader
client.blacklist = [];
async function loadBlist() {
  var res = await pool.query(`SELECT * FROM blacklist`);
  client.blacklist = res.rows.map(e => e.userid);
  console.log('Loaded blacklist')
}
loadBlist();

//event loader
fs.readdir(`./events/`, (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(`.`)[0];
    client.on(eventName, (...args) => eventFunction.run(deletedMessage, pool, client, ...args));
  });
});

//command loader (text based / interactions)
fs.readdir('./commands', (err, folders) => {
  folders.forEach(f => {
    fs.readdir(`./commands/${f}`, (err, commands) => {
      function cLoader(c) {
        var cmd;

        try {
          cmd = require(`./commands/${f}/${c}`);
        } catch (err) {
          client.failedCommands.push(c.replace('.js', ''));
          return console.error(`Loading Error (${c}): ${err.stack}`);
        }
        var cmdName = c.substring(0, c.length - 3); //-.js

        client.aliases[cmdName] = { aliases: [] };
        client.help[cmdName] = { help: cmd.conf.help, format: cmd.conf.format, alias: cmd.conf.alias, category: f, filename: cmdName, DM: cmd.conf.DM, locked: cmd.conf.ownerOnly };

        if (cmd.conf.ownerOnly === false && cmd.conf.slashCommand) {
          const data = cmd.conf.data;
          client.slashCommands.push(data);
        }

        cmd.conf.alias.forEach((alias) => { client.aliases[cmdName].aliases.push(alias); });

        return false;
      }
      console.log(`Loading '${f}' commands... (${commands.length})`);
      commands.forEach((m) => { cLoader(m); client.totalCommands = client.totalCommands + 1; });
    })
  })
});

//beta command loader
if (config.toggle_beta === "y") {
  fs.readdir('./commands-locked', (err, commands) => {
    function cLoader(c) {
      try {
        const cmd = require(`./commands-locked/${c}`);
        var cmdName = c.substring(0, c.length - 3);
        cmd.conf.alias.forEach((alias) => { client.aliases[cmdName].aliases.push(alias); });

        return false;
      } catch (err) {
        console.error(`Beta Loading Error: ${err.stack}`);
        client.failedCommands.push(cmd);
      }
    }
    console.log('Loading beta commands... (' + commands.length + ')');
    commands.forEach((m) => { cLoader(m); client.totalCommands = client.totalCommands + 1; });


  });
}

//command loader (slash commands)
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  if (client.blacklist.includes(interaction.user.id)) return interaction.reply({ content: 'Not allowed', ephemeral: true });
  var options = await interaction.options;
  var args = [];
  var messageContent = '';

  if (options._hoistedOptions[0]) {
    args = options._hoistedOptions.map(e => e.value).join(' ');
    if (!args) {
      args = [];
    }

    messageContent = args;
    args = args.match(/[^\s"]+|"([^"]*)"/g);
  }
  interaction.author = interaction.user;
  var command = interaction.commandName.toLowerCase();

  command = require(`./commands/${client.help[command].category}/${command}.js`);
  client.isInteraction = true;

  if (!interaction.guild && command.conf.DM === false) return interaction.reply('Not allowed in DMs');

  if (command.ownerOnly === true && !config.evalAllow.includes(interaction.user.id)) {
    return interaction.reply('Disabled for testing or owner-only command');
  }

  command.run(client, interaction, args, deletedMessage, pool, tossedSet, roles, messageContent)
});


//Message event
client.on("messageCreate", async message => {
  function dmCheck() {
    if (message.guild) {
      return message.guild.id;
    } else {
      if (!message.content) return;
      return 'default';
    }
  }

  //check user for profile
  var dbResult = await pool.query(`SELECT * FROM profile WHERE userid ='${message.author.id}'`);
  dbResult = dbResult.rows[0];

  if (!dbResult) {
    message.author.hasProfile = false;
  } else {
    message.author.hasProfile = true;
  }

  if (message.content === `<@${client.user.id}>`
    || message.content === `<@!${client.user.id}>`) {
    return message.channel.send('Need help? Try `@' + client.user.username + ' help`');
  }

  if (message.author.bot) return; //No bots
  var botMention = "<@" + client.user.id + ">";
  var botMentionX = "<@!" + client.user.id + ">";

  //Database updaters
  if (message.guild) {

    pool.query(`SELECT * FROM prefixes WHERE serverId ='${message.guild.id}'`).then(row => {
      row = row.rows;
      if (row) {
        returnPrefix = row.prefix;
      } else {
        returnPrefix = config.prefix;
      }
    }).catch(() => {/*console.error*/ });

    pool.query(`SELECT * FROM settings WHERE serverId ='${message.guild.id}'`).then(row => {
      row = row.rows;
      if (!row) {
        console.log(`=> Updated settings table (${message.guild.id})`)
        pool.query(`INSERT INTO settings (serverId, banId) VALUES ('${message.guild.id}', null)`);
      }
    }).catch(() => {/*console.error*/ });
  }

  //Database required section
  pool.query(`SELECT * FROM prefixes WHERE serverId ='${dmCheck()}'`).then(row => {
    row = row.rows;
    if (row[0] === undefined) {
      var customPrefix = config.prefix;
    } else {
      var customPrefix = row[0].prefix;
    }

    message.isCommand = true;

    if (message.guild) {
      var content = message.content.toLowerCase();

      if ((content.indexOf(config.prefix.toLowerCase()) !== 0) &&
        (content.indexOf(customPrefix.toLowerCase()) !== 0) &&
        (content.indexOf(botMention.toLowerCase()) !== 0) &&
        (content.indexOf(botMentionX.toLowerCase()) !== 0)) {
        message.isCommand = false;
      }
    }

    if (message.author.hasProfile) {
      //only iterate at most once a minute
      if (!countedRecently.has(message.author.id)) {
        countedRecently.add(message.author.id);
        setTimeout(() => {
          countedRecently.delete(message.author.id);
        }, 60000);

        if (message.isCommand) {
          var exp = parseInt(dbResult.cmds);
          exp = exp + 2;
          var lvl = parseInt(dbResult.cmds) / 1000;

          var oldLevel = Math.round(lvl);
          var newLevel = Math.round((parseInt(dbResult.cmds) + 2) / 1000);

          if (oldLevel < newLevel) {
            var coins = parseInt(dbResult.coins);
            coins = coins + 25;
            pool.query(`UPDATE profile SET coins = '${coins}' WHERE userid = '${message.author.id}'`);
          }

          pool.query(`UPDATE profile SET cmds = '${exp}' WHERE userid = '${message.author.id}'`);
        } else {
          var exp = parseInt(dbResult.cmds);
          exp = exp + 1;
          var lvl = parseInt(dbResult.cmds) / 800;

          var oldLevel = Math.round(lvl);
          var newLevel = Math.round((parseInt(dbResult.cmds) + 1) / 1000);

          if (oldLevel < newLevel) {
            var coins = parseInt(dbResult.coins);
            coins = coins + 25;
            pool.query(`UPDATE profile SET coins = '${coins}' WHERE userid = '${message.author.id}'`);
          }

          pool.query(`UPDATE profile SET cmds = '${exp}' WHERE userid = '${message.author.id}'`);
          return;
        }
      }
    }


    var handledPrefix; //Which prefix is being used

    if (message.content.startsWith(customPrefix)) {
      handledPrefix = customPrefix;
    } else if (message.content.startsWith(botMention)) {
      handledPrefix = botMention;
    } else if (message.content.startsWith(botMentionX)) {
      handledPrefix = botMentionX;
    } else if (message.content.startsWith(config.prefix)) {
      handledPrefix = config.prefix;
    } else if (!message.guild) {
      handledPrefix = '';
    } else {
      return;
    }

    args = message.content.slice(handledPrefix.length).trim().match(/[^\s"]+|"([^"]*)"/g);
    if (!args || !args[0]) args = [];
    try {
      command = args.shift().toLowerCase();
    } catch (err) {
      command = null;
    }

    //Find command file from alias
    for (const key of Object.keys(client.aliases)) if (client.aliases[key].aliases.includes(command)) command = key;

    //Continue command loading - woo yea baby nested try/catch
    try {
      commandFile = require(`./commands/${client.help[command].category}/${command}.js`);
    } catch (err) {
      try {
        commandFile = require(`./commands-locked/${command}.js`);
      } catch (err) {
        message.isCommand = false;
        return; //oops
      }
    }

    //Cooldown checker
    if (cooldown.has(message.author.id)) {
      return message.channel.send(`Please don't spam commands, ${message.author}.`);
    } else {
      cooldown.add(message.author.id);
      setTimeout(() => {
        cooldown.delete(message.author.id);
      }, 1000);
    }

    //Return if the user isn't allowed to use the command - non-dm in dm or owner by non-owner
    if (commandFile.conf.ownerOnly === true && !config.evalAllow.includes(message.author.id)) {
      const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setTitle("This command is either locked, or currently undergoing changes")
      return message.channel.send({ embeds: [embed] });
    } else {
      if (commandFile.conf.DM === false && !message.guild) return;
      if (client.blacklist.includes(message.author.id)) return;

      try {
        var messageContent = message.content.slice(handledPrefix.length).slice(command.length + 1);

        client.isInteraction = false;
        commandFile.run(client, message, args, deletedMessage, pool, tossedSet, roles, messageContent);
      }
      catch (err) {
        console.error(err);
        client.logChannel.send("```js\n" + Date(Date.now()) + '\n```\n***COMMAND ERROR:***\n```js\nERR: ' + err + '\n```');
      }
    }
  });
});

//error catcher
client.on("error", async error => {
  console.error(error);
  var logChannel = client.channels.resolve(config.logChannel);
  await logChannel.send("```js\n"
    + Date(Date.now())
    + '\n```\n***ERROR:***\n```js\nERR: '
    + error + '\n```');
});

//interaction loader
client.on("ready", () => {
  (async () => {
    try {
      console.log('Loading global interactions....');
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: client.slashCommands },
      );
      console.log('Interactions loaded');
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  })();
})

client.login(token);