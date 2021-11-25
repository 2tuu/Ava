const Discord = require(`discord.js`);
const client = new Discord.Client({
  disableMentions: 'everyone'
});

const fs = require(`fs`);
const config = require(`./config.json`);
const colors = require('./JSON/colors.json');
const { Pool } = require('pg')
const pool = new Pool({
  user: config.dbuser,
  database: config.dbname,
  password: config.dbpass,
  idleTimeoutMillis: 100,
  connectionTimeoutMillis: 100,
  max: 0
});

      client.blacklist = [];
      client.blist = [];
      client.aliases = new Map();
      client.help = new Map();
      client.commandStats = {};
      client.colors = colors;
const deletedMessage = new Set();
const roles = new Set();
const tossedSet = new Set();
const cooldown = new Set();

      client.timeCon = function timeCon(time){
  let unix_timestamp = time;
  var date = new Date(unix_timestamp);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();

  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedTime;
}

process.on('uncaughtException', function(err) { client.logchannel.send('Caught exception: ' + err); });

//Module loaders
fs.readdir(`./events/`, (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(`.`)[0];
        client.on(eventName, (...args) => eventFunction.run(deletedMessage, pool, client, ...args));
    });
});

client.failedCommands = [];
client.totalCommands = 0;

fs.readdir('./commands', (err, commands) => {
    function cLoader(c){
      const cmd = require(`./commands/${c}`);
      var cmdName = c.substring(0, c.length-3);

        try {
            client.aliases[cmdName] = {aliases: []};
            client.help[cmdName] = {help: cmd.conf.help, format: cmd.conf.format, category: cmd.conf.category, filename: cmdName};

            cmd.conf.alias.forEach((alias) => { client.aliases[cmdName].aliases.push(alias); });
            
            return false;
        } catch (err) {
            return console.error(`Loading Error (${cmdName}): ${err}`);
            client.failedCommands.push(c);
        }
    }
    console.log('\x1b[32m','Loading commands...');
    commands.forEach((m) => { cLoader(m); client.totalCommands = client.totalCommands + 1;});

    
});

//beta command loader - ignore this block if self-hosting
if(config.toggle_beta === "y"){
  fs.readdir('./commands-locked', (err, commands) => {
    function cLoader(c){
        try {
            const cmd = require(`./commands-locked/${c}`);
            var cmdName = c.substring(0, c.length-3);

            //ignore for help file
            //client.aliases[cmdName] = {aliases: []};
            //client.help[cmdName] = {help: cmd.conf.help, format: cmd.conf.format};

            cmd.conf.alias.forEach((alias) => { client.aliases[cmdName].aliases.push(alias); });
            
            return false;
        } catch (err) {
            console.error(`Beta Loading Error: ${err}`);
            client.failedCommands.push(c);
        }
    }
    console.log('\x1b[32m','Loading beta commands...');
    commands.forEach((m) => { cLoader(m); client.totalCommands = client.totalCommands + 1;});

    
  });
}
//end of block

console.log('\x1b[32m','Starting...');


//Message event
client.on("message", async message => {
    function dmCheck(){
        if(message.guild){
          return message.guild.id;
        } else {
          if(!message.content) return;
          return 'default';
        }
    }

    if(message.content === `<@${client.user.id}>`
    || message.content === `<@!${client.user.id}>`){
        return message.channel.send('Need help? Try `<@' + client.user.username + '> help`');
    }

    if (message.author.bot) return; //No bots
    var botMention = "<@" + client.user.id + ">";
    var botMentionX = "<@!" + client.user.id + ">";

    //Database updaters
    if(message.guild){

        pool.query(`SELECT * FROM prefixes WHERE serverId ='${message.guild.id}'`).then(row => {
            row = row.rows;
            if(row){
                returnPrefix = row.prefix;
            } else {
                returnPrefix = config.prefix;
            }
        }).catch(() => {/*console.error*/});

        pool.query(`SELECT * FROM settings WHERE serverId ='${message.guild.id}'`).then(row => {
            row = row.rows;
            if(!row){
                pool.query(`INSERT INTO settings (serverId, banId) VALUES ('${message.guild.id}', null)`);
            }
        }).catch(() => {/*console.error*/});
    }

    //Database required section
    pool.query(`SELECT * FROM prefixes WHERE serverId ='${dmCheck()}'`).then(row => {
        row = row.rows;
        if(row[0] === undefined){
          var customPrefix = config.prefix;
        } else {
          //console.log(row);
          var customPrefix = row[0].prefix;
        }
    
      if(message.guild){ //TODO: Clean this up
        var content = message.content.toLowerCase();

        if((content.indexOf(config.prefix.toLowerCase()) !== 0) && 
            (content.indexOf(customPrefix.toLowerCase()) !== 0) &&
              (content.indexOf(botMention.toLowerCase()) !== 0) &&
              (content.indexOf(botMentionX.toLowerCase()) !== 0 ))  return;
      }
    
      var handledPrefix; //Which prefix is being used

      if(message.content.startsWith(customPrefix)){
        handledPrefix = customPrefix;
      } else if(message.content.startsWith(botMention)){
        handledPrefix = botMention;
      } else if(message.content.startsWith(botMentionX)){
        handledPrefix = botMentionX;
      } else if(message.content.startsWith(config.prefix)){
        handledPrefix = config.prefix;
      } else if(!message.guild){
        handledPrefix = '';
      } else {
        return;
      }
    
      args = message.content.slice(handledPrefix.length).trim().match(/[^\s"]+|"([^"]*)"/g);
      if(!args) args = [];
      command = args.shift().toLowerCase();
    
      //Find command file from alias
      for (const key of Object.keys(client.aliases)) if (client.aliases[key].aliases.includes(command)) command = key;
    
      //Continue command loading - woo yea baby nested try/catch
      try{
        commandFile = require(`./commands/${command}.js`);
      } catch(err){try{
        commandFile = require(`./commands-locked/${command}.js`);
      }catch(err){
        return; //oops
      }}
    
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
      if(commandFile.conf.OwnerOnly === true && !config.evalAllow.includes(message.author.id)){
        const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setDescription("This command is either locked, or currently undergoing changes")
        return message.channel.send({embed});
      }
      if(commandFile.conf.DM === false && !message.guild) return;
      if(client.blacklist.includes(message.author.id)) return;
    
    
      try{
        commandFile.run(client, message, args, deletedMessage, pool, tossedSet, roles);
        var cName = commandFile.conf.name;

        if(client.commandStats[cName]){
          client.commandStats[cName] = client.commandStats[cName]+1
        } else {
          client.commandStats[cName] = 1;
        }
      }
      catch(err){
        console.error(err);
        client.logChannel.send("```js\n" + Date(Date.now()) + '\n```\n***COMMAND ERROR:***\n```js\nERR: ' + err + '\n```');
      }
    
      });
});

client.on("error", async error => {
    console.error(error);
    var logChannel = client.channels.resolve(config.logChannel);
    await logChannel.send("```js\n"
                        + Date(Date.now())
                        + '\n```\n***ERROR:***\n```js\nERR: '
                        + error + '\n```');
});

client.login(config.token_prod);