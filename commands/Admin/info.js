const Discord = require("discord.js");
const data = require('./../../plugins/data.json');

exports.run = async (client, message) => {
	var stats = [];
	Object.keys(client.commandStats).forEach(key => { stats.push(key + ': ' + client.commandStats[key]) });
	stats = stats.join('\n');

	const embed = new Discord.MessageEmbed()
		.setAuthor(client.user.username, client.user.avatarURL)
		.setDescription(
			"**Guilds/Users: **" + `${client.guilds.cache.size}/${client.users.cache.size}` + "\n" +
			"**Stats:**\n" + stats
		)
		.setFooter('v.' + `${client.version} ${client.codename}` + ' (current repo version: ' + client.currentVersion + ')')

	client.messageHandler(message, client.isInteraction, { embeds: [embed] })
}

exports.conf = {
	name: "N/A (dev command)",
	help: "View my version information, the artist for my avatar, and other statistics",
	format: "k?info",
	DM: true,
	ownerOnly: true,
	alias: ['stats']
}
