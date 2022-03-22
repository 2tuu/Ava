const AFHConvert = require('ascii-fullwidth-halfwidth-convert');
const converter = new AFHConvert();
const Discord = require('discord.js');

exports.run = (client, message, args) => {
    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .addField("Description", client.help['expand'].help)
            .addField("Usage", '```' + client.help['expand'].format + '```')
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    } else if (args[0].toLowerCase() === "dong" && !args[1]) {
        client.messageHandler(message, client.isInteraction, "https://i.imgur.com/65ldTm4.png");
    } else {
        var messageStr = args.join(' ');
        client.messageHandler(message, client.isInteraction, converter.toFullWidth(messageStr));
    }
}

exports.conf = {
    name: "Expand",
    help: "Convert the text to fullwidth font",
    format: "k?expand [text]",
    DM: true,
    ownerOnly: false,
    alias: ['vapor', 'vapour'], //innit
    slashCommand: true,
    data: {
        name: "expand",
        description: "Convert text to fullwidth",
        options: [
            {
                choices: undefined,
                autocomplete: undefined,
                type: 3,
                name: 'string',
                description: 'Text to be translated',
                required: true
            }
        ],
        default_permission: undefined
    }
}