//https://github.com/2tuu/Kit/blob/master/docs/news.md
const Discord = require("discord.js");

exports.run = (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setDescription("Development announcements can be found [here](https://github.com/2tuu/Kit/blob/master/docs/news.md)")

    message.channel.send({embed});
}

exports.conf = {
    help: "Temporary announcement command",
    format: "n/a",
    DM: true,
    OwnerOnly: false,
    alias: []
}