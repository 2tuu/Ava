const rpgdice = require('droll');
const Discord = require('discord.js');

exports.run = (client, message, args) => {

	if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['roll'].help)
			.addField("Usage", '```' + client.help['roll'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

	if (args[0]) {
		var numbers = args[0].match(/\d+/g);
		if (parseInt(numbers[0]) > 120) {
			const embed = new Discord.MessageEmbed()
				.setTitle("One number was too high")
				.setColor(`0x${client.colors.bad}`)
			return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
		} else if (numbers[1]) {
			if (parseInt(numbers[1]) > 250) {
				const embed = new Discord.MessageEmbed()
					.setTitle("One number was too high")
					.setColor(`0x${client.colors.bad}`)
				return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
			} else {
				var result = rpgdice.roll(numbers[0] + "d" + numbers[1]);
				return client.messageHandler(message, client.isInteraction, "Result: " + result);
			}
		} else {
			if (numbers.length === 1) {
				var result = rpgdice.roll("1d" + args.join(' '));
				if (!result)
					if (result.length > 50) {
						const embed = new Discord.MessageEmbed()
							.setTitle("Too many dice")
							.setColor(`0x${client.colors.bad}`)
						return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
					}
				client.messageHandler(message, client.isInteraction, "Result: " + result);
			} else {
				var result = rpgdice.roll(args.join(' '));
				if (!result) {
					const embed = new Discord.MessageEmbed()
						.setTitle("Incorrect syntax")
						.setColor(`0x${client.colors.bad}`)
					return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
				}
				if (result.length > 50) {
					const embed = new Discord.MessageEmbed()
						.setTitle("Too many dice")
						.setColor(`0x${client.colors.bad}`)
					return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
				}
				client.messageHandler(message, client.isInteraction, "Result: " + result);
			}
		}
	} else {
		const embed = new Discord.MessageEmbed()
			.setTitle("Incorrect syntax")
			.setColor(`0x${client.colors.bad}`)
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}
}

exports.conf = {
	name: "Roll/Dice",
	help: "Roll an imaginary die, can be multi-sided if you use the #d# format",
	format: "k?roll [#d#]\nie. k?roll 1d20 <- rolls one 20-sided die",
	DM: false,
	ownerOnly: false,
	alias: [],
	slashCommand: true,
	data: {
		name: "roll",
		description: "Virtual RPG dice",
		options: [
			{
				choices: undefined,
				autocomplete: undefined,
				type: 3,
				name: 'dice',
				description: 'ie. 1d20',
				required: true
			}
		],
		dm_permission: false
	}
}
