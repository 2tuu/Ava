const Discord = require("discord.js");
const config = require('./../../config.json');

exports.run = async (client, message) => {
        console.log('===restart command issued===')
        const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.neutral}`)
                .setTitle("Process restarting...")

        await client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        process.exit(0);
};

exports.conf = {
        name: "N/A (dev command)",
        help: "N/A",
        format: "N/A",
        DM: true,
        ownerOnly: true,
        alias: ['die']
}