const Discord = require('discord.js');

const config = require("./../../config.json");
exports.run = (client, message, args) => {
    if (!args[0] || !args[0].startsWith('<')) {
        const embed = new Discord.MessageEmbed()
            .addField("Description", client.help['enlarge'].help)
            .addField("Usage", '```' + client.help['enlarge'].format + '```')
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

    if (args[0]) {
        var duArgs = args[0].match(/[^\s:]+|:([^:]*):/g);
        if (duArgs[0] === "<a") {
            var fileType = "gif";
        } else {
            var fileType = "png";
        }
        var emojiID = duArgs[2].replace(">", "");
    }

    if (!emojiID || !args[0] || args[0].length < 1) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Please provide a valid emote")
            .setColor(`0x${client.colors.bad}`)
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

    if (15 < emojiID.length < 20) {
        const embed = new Discord.MessageEmbed()
            .setImage('https://cdn.discordapp.com/emojis/' + emojiID + '.' + fileType + '?v=1)')
            .setDescription('[Link](https://cdn.discordapp.com/emojis/' + emojiID + '.' + fileType + '?v=1)')
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    } else {
        const embed = new Discord.MessageEmbed()
            .setTitle("Please provide a valid emote")
            .setColor(`0x${client.colors.bad}`)
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }
}

exports.conf = {
    name: "Enlarge",
    help: "View an emote's source image",
    format: "k?enlarge [:emote:]",
    DM: false,
    ownerOnly: false,
    alias: [],
    slashCommand: true,
    data: {
        name: "enlarge",
        description: "Enlarge any emote",
        options: [
            {
                choices: undefined,
                autocomplete: undefined,
                type: 3,
                name: 'emote',
                description: 'Put an emote here',
                required: true
            }
        ],
        dm_permission: false
    }
}