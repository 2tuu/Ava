const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql) => {

  if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply("Sorry, you don't have permission to use this.");

  if (!args[0]) {
    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setTitle("I need a member to ban")
    client.messageHandler(message, client.isInteraction, { embeds: [embed] })
    return;
  } else {
    if (!args[0].startsWith('<@')) {
      const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setTitle("Please use the format `ban @user`")
      client.messageHandler(message, client.isInteraction, { embeds: [embed] })
      return;
    }
  }

  var member = message.guild.members.cache.find(user => user.id === args[0].replace('<@', '').replace('>', '').replace('!', ''))

  if (!member) {
    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setTitle("Please mention a valid member of this server")
    client.messageHandler(message, client.isInteraction, { embeds: [embed] })
    return;
  }

  if (!member.bannable) {
    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setTitle("This user is not bannable")
    client.messageHandler(message, client.isInteraction, { embeds: [embed] })
    return;
  }

  let reason = args.slice(1).join(' ');
  if (!reason) reason = "No reason was given";

  await member.ban({ reason: `Ban by ${message.author.tag}: ` + reason }).catch(error => {
    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setTitle("An error occured")
      .setFooter(error)
    client.messageHandler(message, client.isInteraction, { embeds: [embed] })

    console.error(error.stack);
    return;
  });

  const embed = new Discord.MessageEmbed()
    .setColor(`0x${client.colors.good}`)
    .addField("Member Banned", `${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`)
  client.messageHandler(message, client.isInteraction, { embeds: [embed] })
  return;
}

exports.conf = {
  category: "Moderation",
  name: "Ban",
  help: "Ban the mentioned user from the server",
  format: "k?ban [@user]",
  DM: false,
  ownerOnly: false,
  alias: ['bean'],
  slashCommand: true,
  data: {
    name: "ban",
    description: "Ban a user",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'user',
        description: '@ the user you want to ban',
        required: true
      }
    ],
    default_permission: undefined
  }
}