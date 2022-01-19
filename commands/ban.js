const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql) => {
    
  if(!message.member.permissions.has('BAN_MEMBERS')) return message.reply("Sorry, you don't have permission to use this.");

  if(!args[0]){
    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setTitle("I need a member to ban")
    message.channel.send({embed});
    return;
  } else {
    if(!args[0].startsWith('<@')){
      const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setTitle("Please use the format `ban @user`")
      message.channel.send({embed});
      return;
    }
  }

  var member = message.guild.members.cache.find(user => user.id === args[0].replace('<@','').replace('>','').replace('!',''))

  if(!member){
      const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setTitle("Please mention a valid member of this server")
      message.channel.send({embed});
      return;
  }

  if(!member.bannable){
      const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setTitle("This user is not bannable")
      message.channel.send({embed});
      return;
  }

  let reason = args.slice(1).join(' ');
  if(!reason) reason = "No reason was given";

  await member.ban({reason: `Ban by ${message.author.tag}: ` + reason}).catch(error => {
    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setTitle("An error occured")
      .setFooter(error)
    message.channel.send({embed});

    console.error(error.stack);
    return;
  });

  const embed = new Discord.MessageEmbed()
    .setColor(`0x${client.colors.good}`)
    .addField("Member Banned", `${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`)
    message.channel.send({embed});
  return;
}
 
exports.conf = {
  category: "Moderation",
  name: "Ban",
  help: "Ban the mentioned user from the server",
  format: "k?ban [@user]",
  DM: false,
  OwnerOnly: false,
  alias: ['bean']
}