const config = require('./../config.json');
const Discord = require("discord.js");

var perms = '397754625270';
var link = 'https://discord.com/api/oauth2/authorize?client_id=435855803363360779&permissions=397754625270&scope=bot';

exports.run = (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setDescription(`Invite me to your server [here](${link})`)

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