const Discord = require(`discord.js`);
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const fs = require(`fs`);
const config = require(`./config.json`);
const token = config.token_beta;
const colors = require('./plugins/colors.json');
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
client.failedCommands = [];
client.totalCommands = 0;
client.slashCommands = [];
client.blacklist = [];
client.blist = [];
client.aliases = new Map();
client.help = new Map();
client.commandStats = {};
client.colors = colors;
client.isInteraction = false;
client.messageHandler = async function m(message, isInteraction, mContent) {
  var reply;
  if (isInteraction) {
    reply = await message.reply(mContent);
  } else {
    reply = message.channel.send(mContent);
  }
  return reply;
};

const deletedMessage = new Set();
const roles = new Set();
const tossedSet = new Set();
const cooldown = new Set();

client.timeCon = function timeCon(time) {
  let unix_timestamp = time;
  var date = new Date(unix_timestamp);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();

  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedTime;
}

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
fs.readdir('./commands', (err, commands) => {
  function cLoader(c) {
    var cmd;

    try {
      cmd = require(`./commands/${c}`);
    } catch (err) {
      client.failedCommands.push(c.replace('.js', ''));
      return console.error(`Loading Error (${c}): ${err.stack}`);
    }
    var cmdName = c.substring(0, c.length - 3); //-.js

    client.aliases[cmdName] = { aliases: [] };
    client.help[cmdName] = { help: cmd.conf.help, format: cmd.conf.format, category: cmd.conf.category, filename: cmdName };

    if (cmd.conf.ownerOnly === false && cmd.conf.slashCommand) {
      const data = cmd.conf.data;
      client.slashCommands.push(data);
    }

    cmd.conf.alias.forEach((alias) => { client.aliases[cmdName].aliases.push(alias); });

    return false;
  }
  console.log('\x1b[32m', 'Loading commands...');
  commands.forEach((m) => { cLoader(m); client.totalCommands = client.totalCommands + 1; });


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
    console.log('\x1b[32m', 'Loading beta commands...');
    commands.forEach((m) => { cLoader(m); client.totalCommands = client.totalCommands + 1; });


  });
}

//command loader (slash commands)
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
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

  command = require(`./commands/${interaction.commandName.toLowerCase()}.js`);
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
    command = args.shift().toLowerCase();

    //Find command file from alias
    for (const key of Object.keys(client.aliases)) if (client.aliases[key].aliases.includes(command)) command = key;

    //Continue command loading - woo yea baby nested try/catch
    try {
      commandFile = require(`./commands/${command}.js`);
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
        .setDescription("This command is either locked, or currently undergoing changes")
      return message.channel.send({ embed });
    }
    if (commandFile.conf.DM === false && !message.guild) return;
    if (client.blacklist.includes(message.author.id)) return;

    try {
      var messageContent = message.content.slice(handledPrefix.length).slice(command.length + 2);

      client.isInteraction = false;
      commandFile.run(client, message, args, deletedMessage, pool, tossedSet, roles, messageContent);
      var cName = commandFile.conf.name;

      if (client.commandStats[cName]) {
        client.commandStats[cName] = client.commandStats[cName] + 1
      } else {
        client.commandStats[cName] = 1;
      }
    }
    catch (err) {
      console.error(err);
      client.logChannel.send("```js\n" + Date(Date.now()) + '\n```\n***COMMAND ERROR:***\n```js\nERR: ' + err + '\n```');
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
      console.log(' Loading global interactions....');
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: client.slashCommands },
      );
      console.log(' Interactions loaded');
    } catch (error) {
      console.error(error);
    }
  })();
})

client.login(token);