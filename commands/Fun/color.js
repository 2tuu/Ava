const Discord = require('discord.js');
const Canvas = require("canvas");
const neko = require('nekocurl');
const fs = require("fs");
const config = require('./../../config.json');
const usedRecently = new Set();

exports.run = async (client, message, args) => {

	const hex = /^#?[0-9A-F]{6}$/i;

	if (!args[0]) {
		var randomColor = message.guild.members.cache.get(message.author.id).displayHexColor;
		const embed = new Discord.MessageEmbed()
			.setColor("0x" + randomColor.replace("#", ""))
			.setDescription(randomColor)
		client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	} else if (args[0].toLowerCase() === "random") {
		var randomColor = '0x' + (function co(lor) { return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) && (lor.length == 6) ? lor : co(lor); })('');
		var rawColor = randomColor.replace("0x", "");
		rawColor = "#" + rawColor;
		const embed = new Discord.MessageEmbed()
			.setColor(randomColor)
			.setDescription(rawColor)
		client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	} else if (args[0].toLowerCase() == 'avy' || args[0].toLowerCase() == 'avatar') {
		let canvas = Canvas.createCanvas(121, 121);
		let Image = Canvas.Image;
		let ctx = canvas.getContext('2d');
		ctx.imageSmoothingQuality = "low"
		let img = new Image();

		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, 121, 121);

		var avatarUrl = `https://cdn.discordapp.com/avatars/${message.member.id}/${message.member.user.avatar}.png`;
		
		img.src = await neko.get(avatarUrl, { autoString: false });
		ctx.drawImage(img, 0, 0, 121, 121);

		function rgb(r, g, b) {
			function toHex(a) {
				if (a <= 0) return '00';
				else if (a >= 255) return 'FF';
				else return a.toString(16).toUpperCase();
			}
			return toHex(r) + toHex(g) + toHex(b);
		}

		var color1 = ctx.getImageData(24, 24, 1, 1);
			color1 = '#' + rgb(color1.data[0], color1.data[1], color1.data[2])

		var color2 = ctx.getImageData(24, 96, 1, 1);
			color2 = '#' + rgb(color2.data[0], color2.data[1], color2.data[2])

		var color3 = ctx.getImageData(61, 61, 1, 1);
			color3 = '#' + rgb(color3.data[0], color3.data[1], color3.data[2])

		var color4 = ctx.getImageData(96, 24, 1, 1);
			color4 = '#' + rgb(color4.data[0], color4.data[1], color4.data[2])

		var color5 = ctx.getImageData(96, 96, 1, 1);
			color5 = '#' + rgb(color5.data[0], color5.data[1], color5.data[2])

		const embed1 = new Discord.MessageEmbed()
			.setColor("0x" + color1.replace("#", ""))
			.setDescription(color1)
		const embed2 = new Discord.MessageEmbed()
			.setColor("0x" + color2.replace("#", ""))
			.setDescription(color2)
		const embed3 = new Discord.MessageEmbed()
			.setColor("0x" + color3.replace("#", ""))
			.setDescription(color3)
		const embed4 = new Discord.MessageEmbed()
			.setColor("0x" + color4.replace("#", ""))
			.setDescription(color4)
		const embed5 = new Discord.MessageEmbed()
			.setColor("0x" + color5.replace("#", ""))
			.setDescription(color5)

		if (usedRecently.has(message.author.id)) {
			return message.reply("Please wait 2 minutes before using that argument again");
			} else {
			usedRecently.add(message.author.id);
			setTimeout(() => {
				usedRecently.delete(message.author.id);
			}, 120000);
			}
		
		client.messageHandler(message, client.isInteraction, { embeds: [embed1, embed2, embed3, embed4, embed5] });
		

		//console.log('colors: \n' + color1 + '\n' + color2 + '\n' + color3 + '\n' + color4 + '\n' + color5)
	} else if (hex.test(args[0])) {
		const embed = new Discord.MessageEmbed()
			.setColor("0x" + args[0].replace("#", ""))
			.setDescription(args[0])
		client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	} else if (args[0]) {
		var usr = message.guild.members.cache.find(user => user.id === args[0].replace('<@', '').replace('>', '').replace('!', ''))
		if (!usr) {
			const embed = new Discord.MessageEmbed()
				.setTitle("Please mention a valid user")
				.setColor(`0x${client.colors.bad}`)
			return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
		} else {
			var randomColor = usr.displayHexColor;
			const embed = new Discord.MessageEmbed()
				.setColor("0x" + randomColor.replace("#", ""))
				.setDescription(randomColor)
			client.messageHandler(message, client.isInteraction, { embeds: [embed] });
		}
	} else {
		const embed = new Discord.MessageEmbed()
			.setTitle("Please provide a valid hex code")
			.setColor(`0x${client.colors.bad}`)
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

}

exports.conf = {
	name: "Color",
	help: "View a hex code's color, or generate a random one",
	format: "k?color {random/#hex/avatar/avy}",
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