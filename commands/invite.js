const config = require('./../config.json');
const Discord = require("discord.js");

exports.run = (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setDescription(`Invite me to your server [here](${config.invite})`)
    message.channel.send({embed});
}

exports.conf = {
    category: "Utility",
    name: "Invite",
    help: "Print out my invite",
    format: "k?invite",
    DM: true,
    OwnerOnly: false,
    alias: []
}