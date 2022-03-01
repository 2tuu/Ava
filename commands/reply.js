const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    var user = client.users.cache.get(args[0]);

    const embed1 = new Discord.MessageEmbed()
        .setTitle("Suggestion/Report Reply")
        .setThumbnail(message.author.avatarURL)
        .addField("From", message.author.id + " (" + message.author.username + "#" + message.author.discriminator + ")")
        .addField("Reply", args.slice(1).join(' '))
        .setFooter("DO NOT REPLY, THIS WORKS ONE WAY")
        
    try{
        user.send({embed: embed1});
        client.messageHandler(message, client.isInteraction, "Reply sent:\nPreview:")
        client.messageHandler(message, client.isInteraction, {embed: embed1});
    }
    catch(err){
        client.messageHandler(message, client.isInteraction, "ERROR: " + err);
    }
}

exports.conf = {
    category: "Admin",
    name: "N/A (dev command)",
    help: "N/A",
    shortHelp: "[N/A]",
    format: "N/A",
    DM: true,
    ownerOnly: true,
    alias: []
}
