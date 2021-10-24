const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql) => {
 
    var reasonVar = "No reason provided";

    if(!message.member.permissions.has('BAN_MEMBERS')) return message.reply("Sorry, you don't have permission to use this.");

    if(!args[0]) return message.channel.send("I need an ID first.");

    if(args[1]){
       reasonVar = args.slice(1).join(' '); 
    }

        reasonVar = reasonVar + ' - Ban by ' + message.author.tag;

        client.users.fetch(args[0]).catch((err)=>{
            return message.channel.send("I was unable to find that user.");
        });

        var u = await client.users.fetch(args[0]);
        var guild = await client.guilds.cache.fetch(message.guild.id);

        message.channel.send("Attempting to ban " + u.username + '#' + u.discriminator)
        guild.bans.create(args[0]);

 }
 
exports.conf = {
  name: "X-Ban",
  help: "Manually ban a user by ID",
  format: "k?xban [ID]",
  DM: false,
  OwnerOnly: true,
  alias: []
}