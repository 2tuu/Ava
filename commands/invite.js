const config = require('./../config.json');
const Discord = require("discord.js");

exports.run = (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setDescription(`Invite me to your server [here](${config.invite})`)
    client.messageHandler(message, client.isInteraction, { embeds: [embed] });
}

exports.conf = {
    category: "Utility",
    name: "Invite",
    help: "Print out my invite",
    format: "k?invite",
    DM: true,
    ownerOnly: false,
    alias: [],
    slashCommand: true,
    data: {
        name: "invite",
        description: "Print my invite link",
        options: [],
        default_permission: undefined
    }
}