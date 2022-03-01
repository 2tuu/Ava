const Discord = require("discord.js");

exports.run = (client, message, args) => {
	let userID = message.author.id;

	//Find by mention
	if(args.join(' ').startsWith("<@") || args.join(' ').startsWith("<!@")){
		userID = args[0];
		userID = userID.replace("<@", "");
		userID = userID.replace(">", "");
		userID = userID.replace("!", "");
	} else if(!args[0]){
		userID = message.author.id;
	} else if(args[0] === "server"){
		const embed = new Discord.MessageEmbed()
			.setImage(message.guild.iconURL('png'))
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] })
	} else if(args[0].match(/^\d/)){
		userID = args[0];
	} else {
		const embed = new Discord.MessageEmbed()
			.setColor(`0x${client.colors.bad}`)
			.setTitle("Error: Invalid User ID or argument")
		client.messageHandler(message, client.isInteraction, { embeds: [embed] })
		return;
	}


	if(userID === ""){
		const embed = new Discord.MessageEmbed()
			.setColor(`0x${client.colors.bad}`)
			.setTitle("Error: Invalid User ID (Use either user ID or mention them)")
		client.messageHandler(message, client.isInteraction, { embeds: [embed] })
	} else {
		client.users.fetch(userID).then(myUser => {
			const embed = new Discord.MessageEmbed()
				.setDescription("[Link](" + myUser.avatarURL('jpg') + ")")
				.setImage(`${myUser.avatarURL('jpg')}`)
			client.messageHandler(message, client.isInteraction, { embeds: [embed] })
		}).catch((err)=>{
			const embed = new Discord.MessageEmbed()
				.setColor(`0x${client.colors.bad}`)
				.setTitle("Error: Invalid User ID (Use either user ID or mention them)")
				.setFooter(err)
			client.messageHandler(message, client.isInteraction, { embeds: [embed] })
		});
	
	}
}

exports.conf = {
	category: "Fun",
	name: "Avatar",
    help: "View your avatar, the server's icon or someone else's avatar",
	shortHelp: "View an avatar",
    format: "k?avatar {@user/User ID/'server'}",
    DM: false,
    ownerOnly: false,
    alias: ['avy'],
  slashCommand: true
}