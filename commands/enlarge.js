const Discord = require('discord.js');

const config = require("./../config.json");
exports.run = (client, message, args) => {
    if(!args[0]){
        return message.channel.send("Invalid emote");
    } else if(!args[0].startsWith('<')){
        return message.channel.send("Invalid emote");
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
        return message.channel.send("Invalid emote");
    }
    
    if(!args[0]){
        return message.channel.send("Invalid emote");
    } else if(args[0].length < 1){
        return message.channel.send("Invalid emote");
    } else if(15 < emojiID.length < 20){
        const embed = new Discord.MessageEmbed()
        .setImage('https://cdn.discordapp.com/emojis/' + emojiID + '.' + fileType + '?v=1)')
        .setDescription('[Link](https://cdn.discordapp.com/emojis/' + emojiID + '.' + fileType + '?v=1)')
        return message.channel.send(embed);
    } else {
        return message.channel.send("Invalid emote ("+ emojiID.length +")");
    }
}

exports.conf = {
    name: "Enlarge",
    help: "View an emote's source image",
    format: "k?enlarge [:emote:]",
    DM: true,
    OwnerOnly: false,
    alias: []
}