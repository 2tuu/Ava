const Discord = require('discord.js');

exports.run = (client, message, args, deletedMessage, sql) => {

    if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['modlog'].help)
			.addField("Usage", '```' + client.help['modlog'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

    if (!message.member.permissions.has('KICK_MEMBERS')) {
        const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.bad}`)
            .setTitle("You don't have permission to use this\n```KICK_MEMBERS Required```")
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

    if (args[1]) {args[1] = args[1].toLowerCase()}

    function optionApply(option, setting) {
        option = option.toLowerCase();
        setting = setting.toLowerCase();

        if (option === 'ignore') {
            sql.query(`SELECT * FROM modlog WHERE serverid ='${message.guild.id}'`).then(row => {
                row = row.rows[0];
                if (!row) return;

                if (!row.ignore) row.ignore = ''; //for old db entries
                var ignoredChannels = row.ignore.split(',');

                if (args[1].toLowerCase() === 'list') {
                    res = 'Ignored Channels:\n' + row.ignore.split(',').join('\n');
                    const embed = new Discord.MessageEmbed()
                        .setTitle("```" + res + "```")
                    return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                }

                if (!setting) return client.messageHandler(message, client.isInteraction, "I need a channel to ignore");
                var channelToIgnore = setting.replace('<#', '').replace('>', '');

                var res = message.guild.channels.cache.find(r => r.id === channelToIgnore);
                if (!res) return client.messageHandler(message, client.isInteraction, "Sorry, I can't find that channel");

                if (ignoredChannels.includes(channelToIgnore)) {
                    ignoredChannels = ignoredChannels.filter(e => e !== res.id).join(',');
                    client.messageHandler(message, client.isInteraction, `<#${res.id}> has been removed from the list`);

                    sql.query(`UPDATE modlog SET ignore = '${ignoredChannels}' WHERE serverid ='${message.guild.id}'`);
                } else {
                    ignoredChannels.push(res.id);
                    client.messageHandler(message, client.isInteraction, `<#${res.id}> has been added to the list`);

                    sql.query(`UPDATE modlog SET ignore = '${ignoredChannels}' WHERE serverid ='${message.guild.id}'`);
                }

            });
        } else if (option === 'toggle') {
            sql.query(`SELECT * FROM modlog WHERE serverId ='${message.guild.id}'`).then(row => {
                row = row.rows[0];
                if (!row) {
                    sql.query(`INSERT INTO modlog (logkicks, logreactions, logchannels, logemojis, logbans, logleaves, logmembers, logmessages, logroles, serverid, enabled, channel, ignore) VALUES ('no', 'no','no','no','no','no','no','no','no', '${message.guild.id}','yes',null,'')`);
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.good}`)
                        .setTitle("Modlog module Enabled")
                    return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                } else {
                    if (row.enabled === "yes") {
                        const embed = new Discord.MessageEmbed()
                            .setColor(`0x${client.colors.bad}`)
                            .setTitle("Modlog module Disabled")
                        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                        sql.query(`UPDATE modlog SET enabled = 'no' WHERE serverId = '${message.guild.id}'`);
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setColor(`0x${client.colors.good}`)
                            .setTitle("Modlog module Enabled")
                        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                        sql.query(`UPDATE modlog SET enabled = 'yes' WHERE serverId = '${message.guild.id}'`);
                    }
                }
            });
        } else if (option === "setchannel") {
            sql.query(`SELECT * FROM modlog WHERE serverid ='${message.guild.id}'`).then(row => {
                row = row.rows[0];
                if (!row) return;
            });
        } else if (option === "toggleoption") {
            sql.query(`SELECT * FROM modlog WHERE serverid ='${message.guild.id}'`).then(row => {
                row = row.rows[0];
                if (!row) return;

                var optionlist = [
                    'logkicks',
                    'logchannels',
                    'logbans',
                    'logleaves',
                    'logmembers',
                    'logmessages',
                    'logroles'];

                if (optionlist.includes(setting)) {
                    if (row[setting] === 'no') {
                        const embed = new Discord.MessageEmbed()
                            .setColor(`0x${client.colors.good}`)
                            .setTitle(setting + " module enabled.")
                        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                        sql.query(`UPDATE modlog SET ${setting} = 'yes' WHERE serverId = '${message.guild.id}'`);
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setColor(`0x${client.colors.bad}`)
                            .setTitle(setting + " module disabled.")
                        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                        sql.query(`UPDATE modlog SET ${setting} = 'no' WHERE serverId = '${message.guild.id}'`);
                    }
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle('Invalid setting')
                    client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                }
            });
        }
    }

    if (args[0].toLowerCase() === "toggle") {
        if (!args[1]) {
            optionApply('toggle', 'n/a');
        } else {
            optionApply('toggleoption', args[1]);
        }
    } else if (args[0].toLowerCase() === "ignore") {
        optionApply('ignore', args[1]);
    } else if (args[0].toLowerCase() === "setchannel") {

        sql.query(`SELECT * FROM modlog WHERE serverId ='${message.guild.id}'`).then(row => {
            row = row.rows[0];
            if (!row) return;

            if (args[1]) {
                var channelID = args[1].replace("<#", "").replace(">", "");
                sql.query(`UPDATE modlog SET channel = '${channelID}' WHERE serverId = '${message.guild.id}'`);

                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.good}`)
                    .setTitle(`Mod log set to <#${channelID}> (${channelID})`)
                client.messageHandler(message, client.isInteraction, { embeds: [embed] });
            }
        });
    }

}

exports.conf = {
    name: "Modlog",
    help: "Manage the mod logging modules",
    format: `k?modlog toggle [option]
    options:
    -> logKicks
    -> logChannels
    -> logLeaves
    -> logBans
    -> logMembers
    -> logMessages
k?modlog toggle
k?modlog setchannel [#channel]
k?modlog ignore [#channel]`,
    DM: false,
    ownerOnly: false,
    alias: [],
    slashCommand: true,
    data: {
        name: 'modlog',
        description: 'Modlog module configuration',
        options: [
            {
                choices: [
                    { name: 'toggle ban logging', value: 'toggle logbans' },
                    { name: 'toggle kick logging', value: 'toggle logkicks' },
                    { name: 'toggle channel logging', value: 'toggle logchannels' },
                    { name: 'toggle leave logging', value: 'toggle logleaves' },
                    { name: 'toggle member logging', value: 'toggle logmembers' },
                    { name: 'toggle message logging', value: 'toggle logmessages' },
                    { name: 'set log channel', value: 'setchannel' },
                    { name: 'ignore channel', value: 'ignore' },
                ],
                autocomplete: undefined,
                type: 3,
                name: 'setting',
                description: 'What setting to change',
                required: true
            },
            {
                choices: undefined,
                autocomplete: false,
                type: 3,
                name: 'channel',
                description: 'Channel to ignore or use as the mod log',
                required: false
            }
        ],
        default_permission: undefined
    }
}