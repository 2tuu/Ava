const Discord = require("discord.js");

exports.run = (client, message, args, deletedMessage) => {

	if (message.member.permissions.has('MANAGE_MESSAGES') || message.author.id === "378769654942007299") {
		var channelIDVar = message.channel.id;
		try {
				if(deletedMessage[message.guild.id + "-" + channelIDVar].attachments.length > 0){
					const embed = new Discord.MessageEmbed()
						.setDescription(deletedMessage[message.guild.id + "-" + channelIDVar].author + ':\n\n' + deletedMessage[message.guild.id + "-" + channelIDVar].message)
						.setImage(deletedMessage[message.guild.id + "-" + channelIDVar].attachments[0])
					client.messageHandler(message, client.isInteraction, { embeds: [embed] });
					delete deletedMessage[message.guild.id + "-" + channelIDVar];
				} else {
					const embed = new Discord.MessageEmbed()
						.setDescription(deletedMessage[message.guild.id + "-" + channelIDVar].author + ':\n\n' + deletedMessage[message.guild.id + "-" + channelIDVar].message)
					client.messageHandler(message, client.isInteraction, { embeds: [embed] });
					delete deletedMessage[message.guild.id + "-" + channelIDVar];
				}
			}
		catch (err) {
			const embed = new Discord.MessageEmbed()
				.setColor(`0x${client.colors.bad}`)
				.setTitle("No deleted messages in this channel: " + err)
			client.messageHandler(message, client.isInteraction, { embeds: [embed] });
		}
	}
}

exports.conf = {
	name: "Snipe",
	help: "Show the last message that was deleted or edited",
	format: "k?snipe",
	DM: false,
	ownerOnly: false,
	alias: []
}