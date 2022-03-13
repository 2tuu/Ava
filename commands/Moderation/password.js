const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql) => {

    if (!message.member.permissions.has('MANAGE_ROLES')) {
        const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.bad}`)
            .setTitle("Sorry, you don't have permission to use this. (MANAGE_ROLES Required)")
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

    var row = await sql.query(`SELECT * FROM password WHERE serverid ='${message.guild.id}'`);
    row = row.rows[0];

    if (!row) {
        await sql.query(`INSERT INTO password (serverid, password, role, channel) VALUES (${message.guild.id}, 'password', 'null', 'null')`);
    }

    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.bad}`)
            .setTitle("Please check k?help password")
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

    //arg switch/case
    switch (args[0].toLowerCase()) {
        case "setpass":
            setpass(args.slice(1).join(' '));
            break;
        case "setchan":
            setchan(args.slice(1).join(' ').toLowerCase());
            break;
        case "setrole":
            setrole(args.slice(1).join(' ').toLowerCase());
            break;
        default:
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setTitle("Please check k?help password")
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

    //setpass argument
    function setpass(pass) {
        if (!pass || pass.length < 1) {
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setTitle("Please check k?help password")
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }

        sql.query(`UPDATE password SET password = '${pass}' WHERE serverid = '${message.guild.id}'`);

        const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.good}`)
            .setTitle(`Updated password to '${pass}'`)
            .addField(`Make sure it works!`)
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

    //setchan argument
    function setchan(role) {
        role = role.replace('<#', '').replace('>', '');
        var res;

        if (isNaN(role)) {
            res = message.guild.channels.cache.find(r => r.name.toLowerCase() === role);
        } else {
            res = message.guild.channels.cache.find(r => r.id === role);
        }

        if (!res) {
            //return no role found
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setTitle("No channel found")
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }

        sql.query(`UPDATE password SET channel = '${res.id}' WHERE serverid = '${message.guild.id}'`);

        const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.good}`)
            .setTitle(`Updated role to '${res.name}'`)
            .addField(`Make sure it works!`)
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

    //setrole argument
    function setrole(role) {
        role = role.replace('<@&', '').replace('>', '');
        var res;

        if (isNaN(role)) {
            res = message.guild.roles.cache.find(r => r.name.toLowerCase() === role);
        } else {
            res = message.guild.roles.cache.find(r => r.id === role);
        }

        if (!res) {
            //return no role found
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setTitle("No role found")
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }

        sql.query(`UPDATE password SET role = '${res.id}' WHERE serverid = '${message.guild.id}'`);

        const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.good}`)
            .setTitle(`Updated role to '${res.name}'`)
            .addField(`Make sure it works!`)
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

}

exports.conf = {
    name: "Password",
    help: "Set a server password and a channel for it to be typed in\nThis can be used for accepting ToS or showing a user has read the rules\n(ie. put the password at the end of the rules and have a user type it in the password channel to gain access)",
    format: "k?password setpass <passphrase here>\nk?password setchan <channel to type passwords in>\nk?password setrole <name of role to be given>",
    DM: false,
    ownerOnly: false,
    alias: ["pass"],
    slashCommand: true,
    data: {
        name: "password",
        description: "Change server password configuration",
        options: [
            {
                choices: undefined,
                autocomplete: undefined,
                type: 3,
                name: 'arguments',
                description: 'Arguments',
                required: true
            }
        ],
        default_permission: undefined
    }
}