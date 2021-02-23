const Discord = require('discord.js');

exports.run = async (client, message, args, deletedMessage, sql) => {

    var user = await  client.fetchUser(args[0]).catch((err) => {
        return message.channel.send('Could not find user:\n```js\n' + err + '\n```');
    });

    var reason = 'No reason';
    if(args[1]){
        reason = args.slice(1).join(' ');
    }

    const embed = new Discord.MessageEmbed()
        .setDescription('User added to blacklist')
        .addField("Username", `${user.username}#${user.discriminator}`)
        .addField("User ID", `${user.id}`)
        .addField("Reason", reason);
    message.channel.send({embed});
    
    sql.run("INSERT INTO blacklist (userid, reason) VALUES (?, ?)", [user.id, reason]).catch((err) => {
        return message.channel.send('Database error:\n```js\n' + err + '\n```');
    });
    
}

exports.conf = {
    help: "Add a user to the blacklist",
    format: "k?blacklist [ID]",
    DM: true,
    OwnerOnly: true,
    alias: ['blist']
}