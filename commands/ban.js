const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql) => {
    
  if(!message.member.permissions.has('BAN_MEMBERS')) 
    return message.reply("Sorry, you don't have permission to use this.");

  let member = message.mentions.members.first();

  if(!member){
      const embed = new Discord.RichEmbed()
        .setColor(0xF46242)
        .setTimestamp()
        .setTitle("Please mention a valid member of this server")
      message.channel.send({embed});
      return;
  }

  if(!member.bannable){
      const embed = new Discord.RichEmbed()
        .setColor(0xF46242)
        .setTimestamp()
        .setTitle("This user is not bannable")
      message.channel.send({embed});
      return;
  }

  let reason = args.slice(1).join(' ');
  if(!reason) reason = "No reason was given";

  await member.ban(`Ban by ${message.author.tag}: ` + reason).then(() => {

  sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
    if(!row){
      return;
    } else if(row.enabled === "yes" && row.logBans === "yes"){
      message.guild.channels.get(row.channel).send(`\`\`\`diff
-Member Banned
${member.user.tag} for: ${reason}
          \`\`\``).catch((err) => {
            return
          });
        }
      });

  })
    .catch(error => {
      const embed = new Discord.RichEmbed()
      .setColor(0xF46242)
      .setTimestamp()
      .setTitle("An error occured")
      .setFooter(error)
      message.channel.send({embed});
      return;
    });

    const embed = new Discord.RichEmbed()
    .setColor(0xF46242)
    .setTimestamp()
    .addField("Member Banned", `${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`)
    message.channel.send({embed});
    return;
 }
 
exports.conf = {
  help: "Ban the mentioned user from the server",
  format: "k?ban [@user]",
  DM: false,
  OwnerOnly: false,
  alias: ['bean']
}