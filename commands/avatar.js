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
		return message.channel.send({embed});
	} else if(args[0].match(/^\d/)){
		userID = args[0];
	} else {

			const embed = new Discord.MessageEmbed()
				.setColor(0xF46242)
				.setTimestamp() 
				.setTitle("Error: Invalid User ID or argument")
			message.channel.send({embed});
			return;
		
	}
	if(userID === ""){
		const embed = new Discord.MessageEmbed()
			.setColor(0xF46242)
			.setTimestamp()
			.setTitle("Error: Invalid User ID, Username or Mention (Use exact display name)")
		message.channel.send({embed});
	} else {


		client.users.fetch(userID).then(myUser => {
			const embed = new Discord.MessageEmbed()
				.setDescription("[Link](" + myUser.avatarURL('jpg') + ")")
				.setImage(`${myUser.avatarURL('jpg')}`)
			message.channel.send({embed});
		}).catch((err)=>{
			const embed = new Discord.MessageEmbed()
				.setColor(0xF46242)
				.setTimestamp()
				.setTitle("Error: Invalid User ID, Username or Mention (Use exact display name)")
				.setFooter(err)
			message.channel.send({embed});
		});
	
	}
}

exports.conf = {
    help: "View your avatar, the server's icon or someone else's avatar",
    format: "k?avatar {@user/User ID/'server'}",
    DM: false,
    OwnerOnly: false,
    alias: ['avy']
}