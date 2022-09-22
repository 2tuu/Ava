const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql) => {

  if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['xban'].help)
			.addField("Usage", '```' + client.help['xban'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

  var row = await sql.query(`SELECT * FROM xban WHERE serverid ='${message.guild.id}'`);
  row = row.rows[0];
  var userArray = row.userarray.split(',');

  if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply("Sorry, you don't have permission to use this.");

  if (args[0].toLowerCase() === 'list') {
    res = 'Results:\n' + row.userarray.split(',').join('\n');

    const embed = new Discord.MessageEmbed()
      .setDescription("```" + res + "```")
    return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
  } else if (args[0].toLowerCase() === 'delete') {
    if (!args[1]) return client.messageHandler(message, client.isInteraction, 'I need more information than that');
    if (!userArray.includes(args[1])) return client.messageHandler(message, client.isInteraction, "I don't see that ID on the list");

    var res = userArray;
    res = res.filter(e => e !== args[1]);

    sql.query(`UPDATE xban SET userarray = '${res.join(',')}' WHERE serverid ='${message.guild.id}'`);
    return client.messageHandler(message, client.isInteraction, `${args[1]} was removed from the list`);
  }

  if (!args[0]) return client.messageHandler(message, client.isInteraction, "I need an ID first.");
  if (args[0].length < 16) return client.messageHandler(message, client.isInteraction, "This ID is invalid, please try again");
  if (userArray.includes(args[0])) return client.messageHandler(message, client.isInteraction, "This ID is already on the list");

  var res = userArray;
  res.push(args[0]);
  sql.query(`UPDATE xban SET userarray = '${res.join(',')}' WHERE serverid ='${message.guild.id}'`);
  return client.messageHandler(message, client.isInteraction, `${args[0]} was added to the list`);
}

exports.conf = {
  name: "X-Ban",
  help: "Add a user's ID to a list - The bot will automatically ban them if they join\n\nThis is sometimes unreliable, and may delay action if the bot isn't online or able to read messages when the user joins\nDo not rely solely on this module to ban problem users",
  format: "k?xban [User ID]\nk?xban delete [User ID]\nk?xban list",
  DM: false,
  ownerOnly: false,
  alias: [],
  slashCommand: true,
  data: {
    name: "xban",
    description: "Ban a user preemptively",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'user',
        description: 'ID of the user to ban',
        required: true
      }
    ],
    dm_permission: false
  }
}