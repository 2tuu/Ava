const config = require('./../config.json');
const Discord = require("discord.js");

exports.run = (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setDescription("Invite me to your server [here](https://discord.com/api/oauth2/authorize?client_id=435855803363360779&permissions=469888150&redirect_uri=https%3A%2F%2Fbot.kitk.us%2F&scope=bot)")

    message.channel.send({embed});
}

exports.conf = {
    help: "Print out my invite",
    format: "k?invite",
    DM: true,
    OwnerOnly: false,
    alias: []
}