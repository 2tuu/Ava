const Discord = require('discord.js');

const config = require("./../config.json");
exports.run = (client, message, args) => {
    if(!args[0]){
        return client.messageHandler(message, client.isInteraction, "Invalid emote");
    } else if(!args[0].startsWith('<')){
        return client.messageHandler(message, client.isInteraction, "Invalid emote");
    }
    if(args[0]){
        var duArgs= args[0].match(/[^\s:]+|:([^:]*):/g);
        if(duArgs[0] === "<a"){
            var fileType = "gif";
        } else {
            var fileType = "png";
        }
        var emojiID = duArgs[2].replace(">", "");
    }
    
    if(!emojiID){
        return client.messageHandler(message, client.isInteraction, "Invalid emote");
    }
    
    if(!args[0]){
        return client.messageHandler(message, client.isInteraction, "Invalid emote");
    } else if(args[0].length < 1){
        return client.messageHandler(message, client.isInteraction, "Invalid emote");
    } else if(15 < emojiID.length < 20){
        const embed = new Discord.MessageEmbed()
        .setImage('https://cdn.discordapp.com/emojis/' + emojiID + '.' + fileType + '?v=1)')
        .setDescription('[Link](https://cdn.discordapp.com/emojis/' + emojiID + '.' + fileType + '?v=1)')
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    } else {
        return client.messageHandler(message, client.isInteraction, "Invalid emote ("+ emojiID.length +")");
    }
}

exports.conf = {
    category: "Fun",
    name: "Enlarge",
    help: "View an emote's source image",
    shortHelp: "Enlarge an emote",
    format: "k?enlarge [:emote:]",
    DM: true,
    ownerOnly: false,
    alias: [],
  slashCommand: true,
  data: {
    name: "enlarge",
    description: "Enlarge any emote",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'emote',
        description: 'Put an emote here',
        required: true
      }
    ],
    default_permission: undefined
  }
}