const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql) => {
  var row = await sql.query(`SELECT * FROM xban WHERE serverid ='${message.guild.id}'`);
  row = row.rows[0];
  var userArray = row.userarray.split(',');

  if(!message.member.permissions.has('BAN_MEMBERS')) return message.reply("Sorry, you don't have permission to use this.");

  if(args[0].toLowerCase() === 'list'){
    res = 'Results:\n' + row.userarray.split(',').join('\n');

    const embed = new Discord.MessageEmbed()
      .setDescription("```" + res + "```")
    return message.channel.send({embed});
  } else if(args[0].toLowerCase() === 'delete'){
    if(!args[1]) return message.channel.send('I need more information than that');
    if(!userArray.includes(args[1])) return message.channel.send("I don't see that ID on the list");

    var res = userArray;
    res = res.filter(e => e !== args[1]);

    sql.query(`UPDATE xban SET userarray = '${res.join(',')}' WHERE serverid ='${message.guild.id}'`);
    return message.channel.send(`${args[1]} was removed from the list`);
  }

  if(!args[0]) return message.channel.send("I need an ID first.");
  if(args[0].length < 16) return message.channel.send("This ID is invalid, please try again");
  if(userArray.includes(args[0])) return message.channel.send("This ID is already on the list");
  
  var res = userArray;
  res.push(args[0]);
  sql.query(`UPDATE xban SET userarray = '${res.join(',')}' WHERE serverid ='${message.guild.id}'`);
  return message.channel.send(`${args[0]} was added to the list`);
}
 
exports.conf = {
  category: "Moderation",
  name: "X-Ban",
  help: "Add a user's ID to a list - The bot will automatically ban them if they join",
  format: "k?xban [User ID]\nk?xban delete [User ID]\nk?xban list",
  DM: false,
  OwnerOnly: true,
  alias: []
}