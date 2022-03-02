const Discord = require("discord.js");

const fs = require('fs');

exports.run = (client, message, args, deletedMessage, sql) => {

	if (message.member.permissions.has('BAN_MEMBERS')) {

		if (args[0] === "setchannel") {
			var channelID = args[1].replace("<#", "").replace(">", "");

			if (isNaN(channelID) || channelID.length > 23 || channelID.length < 15) {

				const embed = new Discord.MessageEmbed()
					.setColor(`0x${client.colors.bad}`)
					.setDescription("Invalid channel ID")
				return client.messageHandler(message, client.isInteraction, { embeds: [embed] });

			} else {
				const embed = new Discord.MessageEmbed()
					.setDescription("Welcome channel set to Channel ID: " + channelID)
				client.messageHandler(message, client.isInteraction, { embeds: [embed] });
				sql.query(`UPDATE prefixes SET welcomeChannel = '${channelID}' WHERE serverId = '${message.guild.id}'`);
			}

		} else if (args[0] === "edit") {
			const embed = new Discord.MessageEmbed()
				.setDescription("Welcome message set to: " + args.slice(1).join(' '))
			client.messageHandler(message, client.isInteraction, { embeds: [embed] });
			sql.query(`UPDATE prefixes SET welcomeMessage = '${args.slice(1).join(' ')}' WHERE serverId = '${message.guild.id}'`);
		} else if (args[0] === "toggle") {

			sql.query(`SELECT * FROM prefixes WHERE serverId ='${message.guild.id}'`).then(row => {
				row = row.rows[0];

				if (row.shouldwelcome === "true") {
					const embed = new Discord.MessageEmbed()
						.setColor(`0x${client.colors.bad}`)
						.setDescription("Welcome messages disabled")
					client.messageHandler(message, client.isInteraction, { embeds: [embed] });
					sql.query(`UPDATE prefixes SET shouldWelcome = 'false' WHERE serverId = '${message.guild.id}'`);
				} else {
					const embed = new Discord.MessageEmbed()
						.setColor(`0x${client.colors.good}`)
						.setDescription("Welcome messages enabled")
					client.messageHandler(message, client.isInteraction, { embeds: [embed] });
					sql.query(`UPDATE prefixes SET shouldWelcome = 'true' WHERE serverId = '${message.guild.id}'`);
				}

			}).catch((err) => {
				console.error(err);
			});


		} else {
			//invalid sub-command
			const embed = new Discord.MessageEmbed()
				.setColor(`0x${client.colors.bad}`)
				.setDescription("Invalid sub-command")
				.setFooter("Use k?help welcome")
			client.messageHandler(message, client.isInteraction, { embeds: [embed] });
		}

	} else {
		const embed = new Discord.MessageEmbed()
			.setColor(`0x${client.colors.bad}`)
			.setDescription("You don't have permission to do this")
		client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

}

exports.conf = {
	category: "Moderation",
	name: "Welcome",
	help: "Configure guild welcome messages",
	format: "k?welcome toggle\nk?welcome edit\nk?welcome setchannel\n\n{member} is replaced with @user\n{member.username} is replaced with the user's username\n{guild} is replaced with the server's name",
	DM: false,
	ownerOnly: false,
	alias: [],
	slashCommand: true,
	data: {
		name: "welcome",
		description: "Welcome message configuration",
		options: [
			{
				choices: undefined,
				autocomplete: undefined,
				type: 3,
				name: 'arguments',
				description: 'Arguments',
				required: true
			}
		],
		default_permission: undefined
	}
}

//Needs fixed