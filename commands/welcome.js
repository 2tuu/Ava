const Discord = require("discord.js");

const fs = require('fs');

exports.run = (client, message, args, deletedMessage, sql) => {

if(message.member.permissions.has('BAN_MEMBERS')){

	if(args[0] === "setchannel"){
		var channelID =  args[1].replace("<#","").replace(">","");
	
		if(isNaN(channelID) || channelID.length > 23 || channelID.length < 15){
	
			const embed = new Discord.RichEmbed()
			.setColor(0xF46242)
			.setDescription("Invalid channel ID")
			return message.channel.send({embed});
	
		} else {
			const embed = new Discord.RichEmbed()
		.setDescription("Welcome channel set to Channel ID: " + channelID)
		message.channel.send({embed});
		sql.run(`UPDATE prefixes SET welcomeChannel = "${channelID}" WHERE serverId = ${message.guild.id}`);
		}

	} else if(args[0] === "edit"){
		const embed = new Discord.RichEmbed()
		.setDescription("Welcome message set to: " + args.slice(1).join(' '))
		message.channel.send({embed});
		sql.run(`UPDATE prefixes SET welcomeMessage = "${args.slice(1).join(' ')}" WHERE serverId = ${message.guild.id}`);
	} else if(args[0] === "toggle"){

		sql.get(`SELECT * FROM prefixes WHERE serverId ="${message.guild.id}"`).then(row => {
			
			if(row.shouldWelcome === "true"){
				const embed = new Discord.RichEmbed()
		.setColor(0xF46242)
		.setDescription("Welcome messages disabled")
		message.channel.send({embed});
		sql.run(`UPDATE prefixes SET shouldWelcome = "false" WHERE serverId = ${message.guild.id}`);
			} else {
				const embed = new Discord.RichEmbed()
		.setColor(0x32ff58)
		.setDescription("Welcome messages enabled")
		message.channel.send({embed});
		sql.run(`UPDATE prefixes SET shouldWelcome = "true" WHERE serverId = ${message.guild.id}`);
			}
				
				}).catch(() => {
				  console.error;
				});

	
	} else {
		//invalid sub-command
		const embed = new Discord.RichEmbed()
      .setColor(0xF46242)
	  .setDescription("Invalid sub-command")
	  .setFooter("Use k?help welcome")
      message.channel.send({embed});
	}

} else {
	const embed = new Discord.RichEmbed()
			.setColor(0xF46242)
			.setDescription("You don't have permission to do this")
			message.channel.send({embed});
}

	}

    exports.conf = {
        DM: true,
        OwnerOnly: false
    }