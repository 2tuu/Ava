const Discord = require("discord.js");
const config = require('./../../config.json');

exports.run = (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .addField("Setup Instructions", `[Click Here](link)`)
    client.messageHandler(message, client.isInteraction, { embeds: [embed] });
}

exports.conf = {
    name: "How-to",
    help: "Show my setup documentation",
    format: "k?howto",
    DM: true,
    ownerOnly: false,
    alias: [],
    slashCommand: true,
    data: {
        name: "howto",
        description: "Setup instructions",
        options: [],
        default_permission: undefined
    }
}
