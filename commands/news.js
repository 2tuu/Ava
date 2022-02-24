const Discord = require('discord.js');

exports.run = (client, message, args) => {
    var link = 'https://github.com/2tuu/Kit/blob/master/docs/news.md';

    const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.neutral}`)
        .setDescription(`Latest announcement can be found [here](${link})`)
    return message.channel.send({embed});
}

exports.conf = {
    category: "Utility",
    name: "News",
    help: "View the most recent bot announcement",
    format: "k?news",
    DM: true,
    OwnerOnly: false,
    alias: []
}