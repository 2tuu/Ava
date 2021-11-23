const Discord = require("discord.js");
const config = require('./../config.json');

exports.run = async (client, message) => {
        const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.neutral}`)
                .setTitle("Process restarting...")

        await message.channel.send({embed});
        process.exit(0);
};

exports.conf = {
        category: "Admin",
        name: "N/A (dev command)",
        help: "N/A",
        format: "N/A",
        DM: true,
        OwnerOnly: true,
        alias: ['die']
}