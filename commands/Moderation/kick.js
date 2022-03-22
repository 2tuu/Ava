const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql) => {

  if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['kick'].help)
			.addField("Usage", '```' + client.help['kick'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

  if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply("Sorry, you don't have permission to use this.");

  if (!args[0].startsWith('<@')) {
    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setTitle("Please use the format `kick @user`")
    client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    return;
  }

  var member = message.guild.members.cache.find(user => user.id === args[0].replace('<@', '').replace('>', '').replace('!', ''))

  if (!member) {
    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setTitle("Please mention a valid member of this server")
    client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    return;
  }

  if (!member.bannable) {
    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setTitle("This user is not kickable")
    client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    return;
  }

  let reason = args.slice(1).join(' ');
  if (!reason) reason = "No reason was given";

  await member.kick(`Kick by ${message.author.tag}: ` + reason).catch(error => {
    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setTitle("An error occured")
      .setFooter(error)
    client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    return;
  });

  const embed = new Discord.MessageEmbed()
    .setColor(`0x${client.colors.good}`)
    .addField("Member Kicked", `${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`)
  client.messageHandler(message, client.isInteraction, { embeds: [embed] });
  return;
}

exports.conf = {
  name: "Kick",
  help: "Kick the mentioned user from the server",
  format: "k?kick [@user]",
  DM: false,
  ownerOnly: false,
  alias: [],
  slashCommand: true,
  data: {
    name: "kick",
    description: "Kick a user",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'user',
        description: '@ the user you want to kick',
        required: true
      }
    ],
    default_permission: undefined
  }
}