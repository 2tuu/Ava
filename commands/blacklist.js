const Discord = require('discord.js');

//TODO fix this junk
exports.run = async (client, message, args, deletedMessage, sql) => {

    var user = client.users.cache.get(args[0]);

    var reason = 'No reason';
    if(args[1]){
        reason = args.slice(1).join(' ');
    }

    const embed = new Discord.MessageEmbed()
        .setDescription('User added to blacklist')
        .addField("User ID", `${args[0]}`)
        .addField("Reason", reason);
    message.channel.send({embed});
    
    sql.query(`INSERT INTO blacklist (userid, reason) VALUES (${args[0]}, '${reason}')`).catch((err) => {
        return message.channel.send('Database error:\n```js\n' + err + '\n```');
    });
    
}

exports.conf = {
    name: "N/A (dev command)",
    help: "Add a user to the blacklist",
    format: "This is not for you",
    DM: true,
    OwnerOnly: true,
    alias: ['blist']
}