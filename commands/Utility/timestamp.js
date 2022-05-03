var math = require('mathjs');
const Discord = require("discord.js");

exports.run = (client, message, args, deletedMessage, sql) => {
    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .addField("Description", client.help['timestamp'].help)
            .addField("Usage", '```' + client.help['timestamp'].format + '```')
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] })
    }

    var dateNow = (Math.floor(new Date().getTime() / 60000) * 60000) / 1000;
    var arg = args.join(' ').toLowerCase();

    if (args[0].toLowerCase() == 'now') {
        //timestamp for right now
        const embed = new Discord.MessageEmbed()
            .addField('Time', `<t:${dateNow}:T>`, true)
            .addField('Timestamp', dateNow.toString(), true)
        client.messageHandler(message, client.isInteraction, { embeds: [embed] })
    } else if(args[0].toLowerCase() == 'time') {
        const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.bad}`)
            .setTitle("This sub-command is not finished")
        client.messageHandler(message, client.isInteraction, { embeds: [embed] })
    } else {
        if (args.join(' ')) {

            function getSeconds(str) {
                str = str.toLowerCase();

                var days = str.match(/(\d+)\s*d/);
                if (days) str = str.replace(days[0], '');

                var hours = str.match(/(\d+)\s*h/);
                if (hours) str = str.replace(hours[0], '');

                var minutes = str.match(/(\d+)\s*m/);
                if (minutes) str = str.replace(minutes[0], '');

                str.replace(new RegExp(' ', 'g'), '');

                if (!hours) hours = ['0h'];
                if (!minutes) minutes = ['0m'];
                if (!days) days = ['0d'];

                if (str.length > 0) {
                    return null;
                } else {
                    return {
                        m: minutes[0].replace('m', ''),
                        h: hours[0].replace('h', ''),
                        d: days[0].replace('d', '')
                    }
                }
            }

            if (getSeconds(args.join(' '))) {
                var res = getSeconds(args.join(' '));
                var finalTime = dateNow;
                    finalTime = finalTime + (res.m * 60);
                    finalTime = finalTime + (res.h * 3600);
                    finalTime = finalTime + (res.d * 86400);

                const embed = new Discord.MessageEmbed()
                    .addField('Time', `<t:${finalTime}:T>`, true)
                    .addField('Timestamp', finalTime.toString(), true)
                client.messageHandler(message, client.isInteraction, { embeds: [embed] })
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setTitle("Invalid time format, please use `#m#h#d`")
                client.messageHandler(message, client.isInteraction, { embeds: [embed] })
            }
        } else {
            const embed = new Discord.MessageEmbed()
                .addField("Description", client.help['timestamp'].help)
                .addField("Usage", '```' + client.help['timestamp'].format + '```')
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] })
        }
    }

}

//needs testing
exports.conf = {
    name: "Timestamp",
    help: "Generate a timestamp relative to now, or your own local time if you have a profile",
    format: "k?timestamp [now/#h#m/time] {#:##am|pm}",
    DM: true,
    ownerOnly: false,
    alias: ['time'],
    slashCommand: true,
    data: {
        name: "timestamp",
        description: "Timestamp Generator",
        options: [
            {
                choices: undefined,
                autocomplete: undefined,
                type: 3,
                name: 'arguments',
                description: 'Type arguments here',
                required: false
            }
        ],
        default_permission: undefined
    }
}