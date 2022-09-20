const Discord = require("discord.js");
const config = require('./../../config.json');

exports.run = (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .addField("Setup Instructions", `[Click Here](https://github.com/2tuu/Kit/blob/master/docs/setup.md)`)
    client.messageHandler(message, client.isInteraction, { embeds: [embed] });
}

exports.conf = {
    name: "How-to",
    help: "Show my setup documentation",
    format: "k?howto",
    DM: false,
    ownerOnly: false,
    alias: [],
    slashCommand: true,
    data: {
        name: "howto",
        description: "Setup instructions",
        options: [],
        dm_permission: false
    }
}
