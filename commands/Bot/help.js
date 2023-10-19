const Discord = require("discord.js");
const config = require('./../../config.json');

exports.run = (client, message, args) => {

    var commandList = Object.keys(client.help);
    var list = {};
    var lockedCommands = [];

    Object.keys(client.help).forEach(function (key) {
        if (client.help[key].category === "Admin") return; //ignore administration commands
        if (client.help[key].category == "NSFW" && message.channel.nsfw == false) return; //ignore nsfw outside of nsfw channels
        if (client.help[key].DM == false && !message.guild) return; //ignore guild-only commands in dm

        if(client.help[key].locked) lockedCommands.push(client.help[key].filename);

        if (list[client.help[key].category]) {
            list[client.help[key].category].push(client.help[key].filename);
        } else {
            list[client.help[key].category] = [client.help[key].filename];
        }
    });

    var preFinal = {};
    Object.keys(list).forEach(function (key) {
        preFinal[key] = list[key].join(', ');
    });

    var final;
    Object.keys(preFinal).forEach(function (key) {
        final = final + `**${key}**\n\`\`\``;
        final = final + preFinal[key];
        final = final + '```\n'
    });

    final = final.slice(9);

    if (client.failedCommands.length > 0) {
        final = final + "\nThe following commands are broken:\n```\n" + client.failedCommands.join(', ') + "\n```\n"
    }

    if (lockedCommands.length > 0) {
        final = final + "\n**Under development/maintainence**:\n```\n" + lockedCommands.join(', ') + "\n```\n"
    }

    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Command documentation")
            .setDescription("Un-usable commands are not listed • Some commands are not slash commands\n\n`k?command [required argument] {optional argument}`\n" +
                "\n" + final + '[Privacy Policy](https://github.com/2tuu/Kit/blob/master/docs/privacy.md) • [Rules and Terms](https://github.com/2tuu/Kit/blob/master/docs/tos.md)')
        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    } else if (commandList.includes(args[0].toLowerCase())) {
        var aliases = client.help[args[0].toLowerCase()].alias;
        if(aliases.length === 0){
            aliases = '(none)'
        } else {
            aliases = aliases.join(', ');
        }
        const embed = new Discord.MessageEmbed()
            .setTitle("Command documentation")
            .addField("Description", client.help[args[0].toLowerCase()].help)
            .addField("Usage", '```' + client.help[args[0].toLowerCase()].format + '```')
            .addField("Aliases", '```' + aliases + '```')
        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    } else {
        var command = args[0].toLowerCase();
        for (const key of Object.keys(client.aliases)) if (client.aliases[key].aliases.includes(command)) command = key;
        if (commandList.includes(command)) {
            var aliases = client.help[command].alias;
            if(aliases.length === 0){
                aliases = '(none)'
            } else {
                aliases = aliases.join(', ');
            }
            const embed = new Discord.MessageEmbed()
                .setTitle("Command documentation")
                .addField("Description", client.help[command].help)
                .addField("Usage", '```' + client.help[command].format + '```')
                .addField("Aliases", '```' + aliases + '```')
            client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        } else {
            const embed = new Discord.MessageEmbed()
                .setTitle("Sorry, that isn't a command")
                .setColor(`0x${client.colors.bad}`)
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }
    }

}

exports.conf = {
    name: "Help",
    help: "Why do you need help with this one?",
    format: "k?help {command}",
    DM: true,
    ownerOnly: false,
    alias: [],
    slashCommand: true,
    data: {
        name: "help",
        description: "View command documentation",
        options: [
            {
                choices: undefined,
                autocomplete: undefined,
                type: 3,
                name: 'cmd',
                description: 'Command',
                required: false
            }
        ],
        dm_permission: true
    }
}
