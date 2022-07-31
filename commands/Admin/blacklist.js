const Discord = require('discord.js');
const { e } = require('mathjs');

exports.run = async (client, message, args, deletedMessage, sql) => {
    if (args[0].toLowerCase() === 'lookup') {
        sql.query(`SELECT * FROM blacklist WHERE userid ='${args[1]}'`).then(row => {
            row = row.rows[0];
            if (!row) {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription("No results")
                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.neutral}`)
                    .setDescription(`${row.userid} was blacklisted for "${row.reason}"`)
                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
            }
        }).catch((err) => {
            return client.messageHandler(message, client.isInteraction, 'Database error:\n```js\n' + err + '\n```');
        });
    } else if (args[0].toLowerCase() === "list") {
        sql.query(`SELECT * FROM blacklist`).then(row => {
            row = row.rows;
            var formatted = []
            for(var i in row){
                formatted.push(row[i].userid + '\t  ' + row[i].reason)
            }
            var formatted = 'ID\t\t\t  REASON\n' + formatted.join('\n');
            var buf = Buffer.from(formatted, 'utf8');

            message.channel.send({
                files: [{attachment: buf, name: 'log.txt'}]
            });
        }).catch((err) => {
            return client.messageHandler(message, client.isInteraction, 'Database error:\n```js\n' + err + '\n```');
        });
    } else if (args[0].toLowerCase() === "delete") {
        sql.query(`DELETE FROM blacklist WHERE userid ='${args[1]}'`).then(row => {
            row = row.rows;
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.neutral}`)
                .setDescription(`Deleting ${args[1]} from blacklist`)
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }).catch((err) => {
            return client.messageHandler(message, client.isInteraction, 'Database error:\n```js\n' + err + '\n```');
        });
    } else {

        if(!parseInt(args[0])){
            return message.channel.send('Not an ID')
        }
        
        var reason = 'No reason';
        if (args[1]) {
            reason = args.slice(1).join(' ');
        }

        const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.good}`)
            .setDescription('User added to blacklist')
            .addField("User ID", `${args[0]}`)
            .addField("Reason", reason);
        client.messageHandler(message, client.isInteraction, { embeds: [embed] });

        sql.query(`INSERT INTO blacklist (userid, reason) VALUES (${args[0]}, '${reason}')`).catch((err) => {
            return client.messageHandler(message, client.isInteraction, 'Database error:\n```js\n' + err + '\n```');
        });
    }

}

exports.conf = {
    name: "N/A (dev command)",
    help: "Add a user to the blacklist",
    format: "This is not for you",
    DM: true,
    ownerOnly: true,
    alias: ['blist']
}