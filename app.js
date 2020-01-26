const Discord = require("discord.js");
const client = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true
});

//Extra dependancies/variables
const fs = require("fs");
const config = require("./config.json");

//TODO: Make a blacklist table on the db and define here

//Temporary data sets - resets when the bot does
const deletedMessage = new Set();
client.commands = new Set();
client.aliases = {};
const roles = new Set();
const tossedSet = new Set();
const cooldown = new Set();
let queue = {}; //NOTE - this can probably be removed

//SQLite database file
const sql = require("sqlite");
sql.open("./tags.sqlite");

//Event loader (for scripts in ./events, each file is named after their event)
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];

    client.on(eventName, (...args) => eventFunction.run(deletedMessage, sql, client, ...args));
  });
});

//Require every command, cache conf for each
fs.readdir('./commands', (err, commands) => {

  function cLoader(c){
    try {
      const cmd = require(`./commands/${c}`);
      var cmdName = c.replace('.js',''); //TODO: Replace this
      console.log('Loaded ' + cmdName);

      client.aliases[cmdName] = {aliases: []};

      cmd.conf.alias.forEach((alias) => {
      client.aliases[cmdName].aliases.push(alias);

        //client.aliases.push(alias, cmdName);
      });
      return false;
    } catch (err) {
      console.error(">>Loading Error:<< " + err);
    }
  }

  commands.forEach((m) => {
      console.log('Loading module: ' + m);
      cLoader(m);
  });

});






//On-message event
client.on("message", async message => {
  //Global variables
  const logChannel = client.channels.get(config.logChannel);

  //Extras
  //TODO: Fix DM compatibility
  if(message.channel.type === "dm") return; //Return on DM
  if (message.author.bot) return; //Return on bot messages (no infinite loops)

  //Mention variables (for other instances)
  var botMention = "<@" + client.user.id + ">";
  var botMentionX = "<@!" + client.user.id + ">";

  //Database updaters
    sql.get(`SELECT * FROM prefixes WHERE serverId ="${message.guild.id}"`).then(row => {
      if(row){
        returnPrefix = row.prefix;
      } else {
        returnPrefix = 'k?';
      }
    }).catch(() => {
      console.error;
    });

    if(message.guild){ //WIP DM compatibility (only executes in guilds)
      sql.get(`SELECT * FROM settings WHERE serverId ="${message.guild.id}"`).then(row => {
        if(!row){
          sql.run("INSERT INTO settings (serverId, banId) VALUES (?, ?)", [message.guild.id, null]);
        }
      }).catch(() => {
        console.error;
      });
  
  
      sql.get(`SELECT * FROM prefixes WHERE serverId ="${message.guild.id}"`).then(row => {
        if(!row){
          sql.run("INSERT INTO prefixes (prefix, welcomeMessage, welcomeChannel, shouldWelcome, serverId) VALUES (?, ?, ?, ?, ?)", ["k?", "This is a placeholder", "null", "false", message.guild.id]);
          console.log("added to prefixes");
        }
      }).catch(() => {
        console.error;
      });
    }

  //Command handler
  sql.get(`SELECT * FROM prefixes WHERE serverId ="${message.guild.id}"`).then(row => {
    if(!row){
      var customPrefix = "k?";
    } else {
      var customPrefix = row.prefix;
    }


  if(message.guild){ //TODO: Clean this up
    if((message.content.toLowerCase().indexOf(config.prefix.toLowerCase()) !== 0) && 
       (message.content.toLowerCase().indexOf(customPrefix.toLowerCase()) !== 0) &&
        (message.content.toLowerCase().indexOf(botMention.toLowerCase()) !== 0) &&
          (message.content.toLowerCase().indexOf(botMentionX.toLowerCase()) !== 0 ))  return;
  }

  var handledPrefix;

  if(message.content.startsWith(customPrefix)){
    handledPrefix = customPrefix;
  } else if(message.content.startsWith(botMention)){
    handledPrefix = botMention;
  } else if(message.content.startsWith(botMentionX)){
    handledPrefix = botMentionX;
  } else if(message.content.startsWith(config.prefix)){
    handledPrefix = config.prefix;
  } else {
    return;
  }

  pLength = handledPrefix.length;
  args = message.content.slice(handledPrefix.length).trim().match(/[^\s"]+|"([^"]*)"/g);
  command = args.shift().toLowerCase();

  //Find command file from alias
  for (const key of Object.keys(client.aliases)) if (client.aliases[key].aliases.includes(command)) command = key;

  //Continue command loading
  try{
    commandFile = require(`./commands/${command}.js`);
  } catch(err){
    return; //return if command file doesn't exist, errors are already reported in loading stage
  }

  if(commandFile.conf.OwnerOnly === true && !config.evalAllow.includes(message.author.id)) return;

  try{
    commandFile.run(client, message, args, deletedMessage, sql, tossedSet, roles, queue);
  }
  catch(err){
    console.error(error);
    var logChannel = client.channels.get(config.logChannel);
    logChannel.send("```js\n" + Date(Date.now()) + '\n```\n***COMMAND LOADING ERROR:***\n```js\nLikely connection reset.\nERR: ' + error + '\n```');
  }

  });
});

client.on("error", async error => {
  console.error(error);
  var logChannel = client.channels.get(config.logChannel);
  await logChannel.send("```js\n" + Date(Date.now()) + '\n```\n***ERROR:***\n```js\nLikely connection reset.\nERR: ' + error + '\n```');
});

//Login
client.login(config.token);