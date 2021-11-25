const Discord = require('discord.js');

//TODO fix this junk
exports.run = async (client, message, args, deletedMessage, sql) => {

    if(args[0].toLowerCase() === 'lookup'){
        sql.query(`SELECT * FROM blacklist WHERE userid ='${args[1]}'`).then(row=>{
            row = row.rows[0];
            if(!row){
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription("No results")
                return message.channel.send({embed});
            } else {
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.neutral}`)
                .setDescription(`${row.userid} was blacklisted for "${row.reason}"`)
                return message.channel.send({embed});
            }
        }).catch((err) => {
            return message.channel.send('Database error:\n```js\n' + err + '\n```');
        });
    } else if (args[0].toLowerCase() === "list"){
        sql.query(`SELECT * FROM blacklist`).then(row=>{
            row = row.rows;
            if(row.length < 1){
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription("No results")
                return message.channel.send({embed});
            } else {
                var res = [];

                row.forEach(e => {
                    res.push(`${e.userid} - ${e.reason}`)
                });

                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.neutral}`)
                .setDescription(res)
                return message.channel.send({embed});
            }
        }).catch((err) => {
            return message.channel.send('Database error:\n```js\n' + err + '\n```');
        });
    } else if(args[0].toLowerCase() === "delete"){
        sql.query(`DELETE FROM blacklist WHERE userid ='${args[1]}'`).then(row=>{
            row = row.rows;
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.neutral}`)
                .setDescription(`Deleting ${args[1]} from blacklist`)
                return message.channel.send({embed});
        }).catch((err) => {
            return message.channel.send('Database error:\n```js\n' + err + '\n```');
        });
    } else {

    var reason = 'No reason';
    if(args[1]){
        reason = args.slice(1).join(' ');
    }

    const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.good}`)
        .setDescription('User added to blacklist')
        .addField("User ID", `${args[0]}`)
        .addField("Reason", reason);
    message.channel.send({embed});
    
    sql.query(`INSERT INTO blacklist (userid, reason) VALUES (${args[0]}, '${reason}')`).catch((err) => {
        return message.channel.send('Database error:\n```js\n' + err + '\n```');
    });
    }
    
}

exports.conf = {
    category: "Admin",
    name: "N/A (dev command)",
    help: "Add a user to the blacklist",
    format: "This is not for you",
    DM: true,
    OwnerOnly: true,
    alias: ['blist']
}