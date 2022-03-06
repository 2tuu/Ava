const Discord = require("discord.js");

exports.run = (client, message, args, deletedMessage) => {
	if (message.member.permissions.has('MANAGE_MESSAGES') || message.author.id === "378769654942007299") {
		var channelIDVar = message.channel.id;
		try {
			if (args[0]) {
				var type = deletedMessage[message.guild.id + "-" + args[0].replace("<#", "").replace(">", "")].type;
				const embed = new Discord.MessageEmbed()
					.setAuthor(deletedMessage[message.guild.id + "-" + args[0].replace("<#", "").replace(">", "")].author + " (" + type + ")", deletedMessage[message.guild.id + "-" + channelIDVar].avatar)
					.setDescription(deletedMessage[message.guild.id + "-" + args[0].replace("<#", "").replace(">", "")].message)
					.setFooter("Message was sniped by " + message.author.tag)
				client.messageHandler(message, client.isInteraction, { embeds: [embed] });
				delete deletedMessage[message.guild.id + "-" + args[0].replace("<#", "").replace(">", "")];
			} else {
				var type = deletedMessage[message.guild.id + "-" + channelIDVar].type;
				const embed = new Discord.MessageEmbed()
					.setAuthor(deletedMessage[message.guild.id + "-" + channelIDVar].author, deletedMessage[message.guild.id + "-" + channelIDVar].avatar)
					.setDescription(deletedMessage[message.guild.id + "-" + channelIDVar].message)
					.setFooter("Message was sniped by " + message.author.tag)
				client.messageHandler(message, client.isInteraction, { embeds: [embed] });
				delete deletedMessage[message.guild.id + "-" + channelIDVar];
			}
		}
		catch (err) {
			const embed = new Discord.MessageEmbed()
				.setColor(`0x${client.colors.bad}`)
				.setTitle("No deleted messages in this channel")
			client.messageHandler(message, client.isInteraction, { embeds: [embed] });
		}
	}
}

exports.conf = {
	name: "Snipe",
	help: "Show the last message that was deleted or edited",
	format: "k?snipe",
	DM: false,
	ownerOnly: true, //fix attachment behavior
	alias: []
}