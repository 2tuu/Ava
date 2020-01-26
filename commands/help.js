const Discord = require("discord.js");
const help = require("./../JSON/help.json");

exports.run = (client, message, args) => {

    if(!args[0]){
        const embed = new Discord.RichEmbed()
        .setTitle("Module List - <> = Disabled")
        .setDescription("Use `@kit checkprefix` to see this server's prefix\nView site [Here](https://bot.kitk.us/)\n")
        .addField("Staff Commands", "```Ban, Kick, Purge, Prefix, Snipe, RoleBan, SlowMode```")
        .addField("Utility Commands", "```Quote, Help, Avatar, Info, Youtube, ReportBug, Temp, Welcome, NonASCII, Imgur, Profile, Coins, Note```")
        .addField("Searching Commands", "```Weather, Bird, Cat, Rabbit```")
        .addField("Fun Commands", "```Color, 8Ball, Roll, Interactions (list), Tag```")
        .addField("Text Manipulation", "```Reverse, Expand, OwO```")
        .addField("NSFW", "```InspiroBot, <UD>, e621, gelbooru```")
        .addField("In Development", "```Forecast, Music, FML```")
        .setFooter("Use k?help <module> to view more information")
        message.channel.send({embed});
    } else if (!help[args[0].toLowerCase()]){
        const embed = new Discord.RichEmbed()
        .setColor(0xF46242)
        .setTimestamp() //Write to JSON
        .setTitle("This module isn't in the list")
        message.channel.send({embed});
    } else {
        argVar = args[0].toLowerCase();
        const embed = new Discord.RichEmbed()
        .setTimestamp() //Write to JSON
        .addField(help[argVar].name, help[argVar].description)
        message.channel.send({embed});
    }

}

exports.conf = {
    DM: true,
    OwnerOnly: false,
    alias: []
}
