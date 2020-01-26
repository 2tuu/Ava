const Discord = require("discord.js");
const client = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true
});
const fs = require("fs");

const config = require("./config.json");

const api = require('./plugins/api.js');
const tag = require('./plugins/tag.js');

delete require.cache[require.resolve(`./JSON/blacklist.json`)];
var blacklist = require("./JSON/blacklist.json");


//Temporary data sets - resets when the bot does
const deletedMessage = new Set();
const roles = new Set();
const tossedSet = new Set();
const cooldown = new Set();
let queue = {}; //NOTE - this can probably be removed

//SQLite database file
const sql = require("sqlite");
sql.open("./tags.sqlite");

//Event loader (for events that aren't in this file)
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];

    client.on(eventName, (...args) => eventFunction.run(sql, client, ...args));
  });
});


/*

DELETES AND EDITS

*/

//Message logger
client.on("messageUpdate", async (message, oldMessage, newMessage) => {
  if(message.author.bot) return;

  var channelID = message.channel.id;

  var oldMessageVar = await oldMessage.content;
  var newMessageVar = await newMessage;

  var messageContent = message.content.trim().replace(new RegExp(/(?:discord(?:(?:.|.?dot.?)(?:gg|me|li|to)|app(?:.|.?dot.?)com\/invite)|(invite|disco)(?:.|.?dot.?)gg)\/[\da-z]+/igm), "[INVITE]")
  oldMessageVar = oldMessageVar.trim().replace(new RegExp(/(?:discord(?:(?:.|.?dot.?)(?:gg|me|li|to)|app(?:.|.?dot.?)com\/invite)|(invite|disco)(?:.|.?dot.?)gg)\/[\da-z]+/igm), "[INVITE]")


      if(!deletedMessage[message.guild.id + "-" + channelID]){
         deletedMessage[message.guild.id + "-" + channelID] = {
             message: message.oldMessage,
             author: message.author.tag,
             avatar: message.author.avatarURL,
             newContent: message.newMessage,
             type: "Edited"
           };
      }
      deletedMessage[message.guild.id + "-" + channelID].message = messageContent + " ⇨ " + oldMessageVar;
      deletedMessage[message.guild.id + "-" + channelID].author = message.author.username;
      deletedMessage[message.guild.id + "-" + channelID].avatar = message.author.avatarURL;
      
});

/*

DELETES AND EDITS

*/

//Message Logger
client.on("messageDelete", (message) => {


  var messageContent = (message.content.trim().replace(new RegExp(/(?:discord(?:(?:.|.?dot.?)(?:gg|me|li|to)|app(?:.|.?dot.?)com\/invite)|(invite|disco)(?:.|.?dot.?)gg)\/[\da-z]+/igm), "[INVITE]"));
  
      //console.log(message.channel.id);
      var channelID = message.channel.id;
  
          if(!deletedMessage[message.guild.id + "-" + channelID]){
             deletedMessage[message.guild.id + "-" + channelID] = {
                 message: messageContent,
                 author: message.author.tag,
                 avatar: message.author.avatarURL,
                 type: "Deleted"
               };
          }
          deletedMessage[message.guild.id + "-" + channelID].message = messageContent;
          deletedMessage[message.guild.id + "-" + channelID].author = message.author.username;
          deletedMessage[message.guild.id + "-" + channelID].avatar = message.author.avatarURL;
          
    });


//On-message event
client.on("message", async message => {

  if(message.channel.type === "dm") return;

  sql.get(`SELECT * FROM prefixes WHERE serverId ="${message.guild.id}"`).then(row => {

    if(!row){
      var customPrefix = "k?";
    } else {
      var customPrefix = row.prefix;
    }

    const logChannel = client.channels.get(config.logChannel);
  
    if (message.author.bot) return;
  
    if(message.guild){

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

    var botMention = "<@" + client.user.id + ">";
    var botMentionX = "<@!" + client.user.id + ">";
  
    //Command handler
    if(message.guild){
    if((message.content.toLowerCase().indexOf(config.prefix.toLowerCase()) !== 0) && 
       (message.content.toLowerCase().indexOf(customPrefix.toLowerCase()) !== 0) &&
        (message.content.toLowerCase().indexOf(botMention.toLowerCase()) !== 0) &&
          (message.content.toLowerCase().indexOf(botMentionX.toLowerCase()) !== 0 ))  return;
    }
    
    var args = message.content.slice(config.prefix.length).trim().match(/[^\s"]+|"([^"]*)"/g);
    var command = args.shift().toLowerCase();
    
    if(message.content.startsWith(customPrefix)){
    pLength = customPrefix.length;
    args = message.content.slice(customPrefix.length).trim().match(/[^\s"]+|"([^"]*)"/g);
    
    if(!args){
      args = [];
    }

    command = args.shift().toLowerCase();
    }
  
    if(message.content.startsWith(botMention)){
      pLength = botMention.length;
      args = message.content.slice(botMention.length).trim().match(/[^\s"]+|"([^"]*)"/g);
      command = args.shift().toLowerCase();
      }
  
      if(message.content.startsWith(botMentionX)){
        pLength = botMentionX.length;
        args = message.content.slice(botMentionX.length).trim().match(/[^\s"]+|"([^"]*)"/g);
        command = args.shift().toLowerCase();
        }
  
        //Command alias checker - messy but working
        delete require.cache[require.resolve(`./JSON/aliases.json`)];
        var aliasAR = require("./JSON/aliases.json");

        for (const key of Object.keys(aliasAR)) if (aliasAR[key].aliases.includes(command)) command = key;

        sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {
          if(!message.author.bot){
            if(!row){
              console.log('no profile - not logging command use');
            } else {
             //sql.run(`UPDATE profile SET cmds = "${parseFloat(row.cmds + 1)}" WHERE userId = "${message.author.id}"`);
            
            }
          }
        });

    //Eval
    if(command === "eval"){
      async function evalCMD(){
        //message.guild.members.find("displayName", "Kab").id
       // admin.eval(sql, axios, birb, os, defaultColor, client, message, args, data, fs, neko, nekoClient, help, settings);
    //new 
    function clean(text) {
      if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
        return text;
      }
    
    if(config.evalAllow.includes(message.author.id)){
    
    try {
      const code = args.join(" ");
      let evaled = eval(code);
    
      if (typeof evaled !== "string")
      evaled = require("util").inspect(evaled);
    
      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
    
    } else {
      const embed = new Discord.RichEmbed()
      .setColor(0xF46242)
      .setTimestamp() //Write to JSON
      .setTitle("You do not have permission to do this. (Bot Owner required)")
      message.channel.send({embed});
        }
        //new
      }
    
      evalCMD();
    } else if(command === "sql"){
      if(message.author.id === config.owner){
        sql.run(`${args.join(' ')}`).then(()=>{
            message.channel.send("Sent");
        }).catch((err) => {
            message.channel.send("ERR: " + err);
        });
      }
    } else {

      if(message.guild){
        var messageName = message.guild.name;
      } else {
        var messageName = "DM";
      }

    console.log(Date(Date.now()) + "\n" + message.author.username + 
       ">>\n" + messageName + 
       ">>\n" + "CMD>> '" + command + "'\n" + 
                "ARG>> " + args.join(", ") + "\n");
    console.log('\x1b[32m', "=======");               
  
    try {

      if(blacklist.b.includes(message.author.id)){
        console.log("User Blacklisted: " + message.author.id);
      } else {

      let commandFile;

      //Prevents "Invalid command" error
      try{
       commandFile = require(`./commands/${command}.js`);
      } catch(err){
        return;
      }
      

      //logger
      logChannel.send("```js\n" + Date(Date.now()) +
      "\n\n" + message.author.username + 
      ">>" + messageName + 
      ">>\n" + "CMD>> '" + command + "'\n" + 
               "ARG>> " + args.join(", ") + "\n" + 
              "```");

      if(commandFile.conf.DM === true && commandFile.conf.OwnerOnly === false){

        if (cooldown.has(message.author.id)) {
          //cooldown trigger
          logChannel.send(`<@${config.owner}>\n` + '```js\nERROR: COOLDOWN REACHED:\nUSER ID: ' + message.author.id + "\nUSER: "+ `${message.author.username}#${message.author.discriminator}\nCHANNEL: ${message.channel.id}` +"```")
        } else {
        cooldown.add(message.author.id);
        setTimeout(() => {
          cooldown.delete(message.author.id);
        }, 700);
          }
      
        function cmd(){

          //if(!commandFile) return;

          commandFile.run(client, message, args, deletedMessage, sql, tossedSet, roles, queue);
          }

          try{ cmd(); 
          }
          catch(err){ logChannel.send("**ERROR:**\n```js\n" + err.stack + "\n```\n==="); }
      
    } else if(commandFile.conf.OwnerOnly = true && message.author.id === config.owner){

      function cmd(){

        //if(!commandFile) return;

        commandFile.run(client, message, args, deletedMessage, sql, tossedSet, roles, queue);
        }

        try{
          cmd();
        }
        catch(err){ logChannel.send("**ERROR:**\n```js\n" + err.stack + "\n```\n==="); }

     } else if(commandFile.conf.DM === false){
        const embed = new Discord.RichEmbed()
      .setColor(0xF46242)
      .setTitle("This command is disabled, or locked for developer use")
      message.channel.send({embed});
      }
    
    }
    } catch (err) {

      logChannel.send(`\`\`\`js
      Invalid command:
${err.stack}
      \`\`\``)
      console.error;
      //message.channel.send("err: " + err)
    }
  }
  
  
});
});

client.on("error", async error => {

console.error(error);

var logChannel = client.channels.get(config.logChannel);
await logChannel.send("```js\n" + Date(Date.now()) + '\n```\n***ERROR:***\n```js\nLikely connection reset.\nERR: ' + error + '\n```');

});

client.login(config.token);
