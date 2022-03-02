const Discord = require("discord.js");

exports.run = (client, message, args) => {

    var commandList = Object.keys(client.help);
    var list = {};

    Object.keys(client.help).forEach(function (key) {
        if (client.help[key].category === "Admin") return; //ignore administration commands

        if (list[client.help[key].category]) {
            list[client.help[key].category].push(client.help[key].filename);
        } else {
            list[client.help[key].category] = [client.help[key].filename];
        }
    });

    client.help.forEach(e => {
        if (list[e.category]) {
            list[e.category].push(e.filename);
        } else {
            list[e.category] = [e.filename];
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
        final = final + "\nThe following commands are broken: `" + client.failedCommands.join(', ') + "`"
    }


    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Command documentation")
            .setDescription("Use this command to view what a command does\n`[required argument]` `{optional argument}`\n" +
                "\n" + final)
        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    } else if (commandList.includes(args[0].toLowerCase())) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Command documentation")
            .addField("Description", client.help[args[0].toLowerCase()].help)
            .addField("Usage", '```' + client.help[args[0].toLowerCase()].format + '```')
        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    } else {
        return client.messageHandler(message, client.isInteraction, "That's not a command, try again");
    }

}

exports.conf = {
    category: "Utility",
    name: "Help",
    help: "Why do you need help with this one?",
    format: "k?help [command]",
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
        default_permission: undefined
    }
}
