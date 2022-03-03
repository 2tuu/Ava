const Discord = require('discord.js');

exports.run = (client, message, args) => {

	const hex = /^#?[0-9A-F]{6}$/i;

	if (args[0] === "random") {
		var randomColor = '0x' + (function co(lor) { return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor); })('');
		var rawColor = randomColor.replace("0x", "");
		rawColor = "#" + rawColor;
		const embed = new Discord.MessageEmbed()
			.setColor(randomColor)
			.setDescription(rawColor)
		client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	} else if (!args[0]) {
		var randomColor = message.guild.members.cache.get(message.author.id).displayHexColor;
		const embed = new Discord.MessageEmbed()
			.setColor("0x" + randomColor.replace("#", ""))
			.setDescription(randomColor)
		client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	} else if (hex.test(args[0])) {
		const embed = new Discord.MessageEmbed()
			.setColor("0x" + args[0].replace("#", ""))
			.setDescription(args[0])
		client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	} else if (args[0]) {
		var usr = message.guild.members.cache.find(user => user.id === args[0].replace('<@', '').replace('>', '').replace('!', ''))
		if (!usr) {
			client.messageHandler(message, client.isInteraction, "Please mention a valid user");
		} else {
			var randomColor = usr.displayHexColor;
			const embed = new Discord.MessageEmbed()
				.setColor("0x" + randomColor.replace("#", ""))
				.setDescription(randomColor)
			client.messageHandler(message, client.isInteraction, { embeds: [embed] });
		}
	} else {
		client.messageHandler(message, client.isInteraction, "Please provide a valid hex color code");
	}

}

exports.conf = {
	name: "Color",
	help: "View a hex code's color, or generate a random one",
	format: "k?color [random/#hex]",
	DM: false,
	ownerOnly: false,
	alias: ['colour'], //innit
	slashCommand: true,
	data: {
		name: "color",
		description: "Generate or visualize a hex code",
		options: [
			{
				choices: undefined,
				autocomplete: undefined,
				type: 3,
				name: 'arguments',
				description: 'Arguments',
				required: false
			}
		],
		default_permission: undefined
	}
}