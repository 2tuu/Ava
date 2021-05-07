const Discord = require('discord.js');

exports.run = (client, message, args) => {
    
	const hex = /^#?[0-9A-F]{6}$/i;;
	if(args[0] === "random"){
		var randomColor = '0x' + (function co(lor){   return (lor += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)]) && (lor.length == 6) ?  lor : co(lor); })('');
		var rawColor = randomColor.replace("0x", "");
		rawColor = "#" + rawColor;
		const embed = new Discord.MessageEmbed()
			.setColor(randomColor)
			.setImage("https://api.alexflipnote.xyz/colour/image/" + rawColor.replace("#",""))
			.setFooter(rawColor)
		message.channel.send({embed});
	} else if(!args[0]){
		var randomColor = message.guild.members.cache.get(message.author.id).displayHexColor;
		const embed = new Discord.MessageEmbed()
		.setColor("0x" + randomColor.replace("#", ""))
		.setImage("https://api.alexflipnote.xyz/colour/image/" + randomColor.replace("#", ""))
		.setFooter(randomColor)
		message.channel.send({embed});
	} else if(hex.test(args[0])){
		const embed = new Discord.MessageEmbed()
		.setColor("0x" + args[0].replace("#", ""))
		.setImage("https://api.alexflipnote.xyz/colour/image/" + args[0].replace("#", ""))
		.setFooter(args[0])
		message.channel.send({embed});
	} else if(args[0]){
		var usr = message.guild.members.cache.get(message.mentions.members.first());
		if(!usr){
			message.channel.send("Please mention a valid user");
		} else {
			var randomColor = usr.displayHexColor;
			const embed = new Discord.MessageEmbed()
				.setColor("0x" + randomColor.replace("#", ""))
				.setImage("https://api.alexflipnote.xyz/colour/image/" + randomColor.replace("#", ""))
				.setFooter(randomColor)
			message.channel.send({embed});
		}
	} else {
		message.channel.send("Please provide a valid hex color code");
	}

}

exports.conf = {
    help: "View a hex code's color, or generate a random one",
    format: "k?color [random/#hex]",
    DM: false,
    OwnerOnly: false,
    alias: []
}