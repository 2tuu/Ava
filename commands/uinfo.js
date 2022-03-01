const Discord = require('discord.js');

exports.run = async (client, message, args) => {

	try{


    if(!args[0]){
        var searchUser = await message.guild.members.fetch(message.author.id);
    } else {
		var id = args[0].replace('<@', '').replace('>', '').replace('!', '');
		var searchUser = await message.guild.members.fetch(id);
	}


	var age = Math.round((Date.now() - ((message.createdTimestamp) - (searchUser.joinedTimestamp)))/1000);
	if(!searchUser.displayHexColor){
		var color = "#ffffff";
	} else {
		var color = searchUser.displayHexColor;
	}
	if(!searchUser.displayHexColor){
		var color = "#ffffff";
	} else {
		var color = searchUser.displayHexColor;
	}

	var roleVar =  searchUser._roles;

	
	if(roleVar.length > 1){
		var roleList = " <@&" + roleVar.join(">\n <@&") + ">";
	} else if(roleVar.length === 1){
		var roleList = " <@&" + roleVar + ">"
	} else {
		var roleList = " No Roles";
	}

		const embed = new Discord.MessageEmbed()
			.setColor(color)
			.setThumbnail(`https://cdn.discordapp.com/avatars/${searchUser.id}/${searchUser.user.avatar}.webp`)
			.setDescription(`User Info\n\n` 
			+ "**User ID:** " + searchUser.id
			+ "\n**Username:** " + searchUser.user.username + "#" + searchUser.user.discriminator
			+ "\n**Bot:** " + searchUser.user.bot
			+ "\n**Joined Server:** " + '<t:'+age+':R>'
			+ "\n**Joined Discord:** " + '<t:'+Math.round(Date.parse(new Date(searchUser.id /4194304 + 1420070400000))/1000)+':R>'
			+ "\n \n**Roles:**\n" + roleList)
			client.messageHandler(message, client.isInteraction, { embeds: [embed] });

	}catch(err){
		const embed = new Discord.MessageEmbed()
		.setColor(0xF46242)
		.setDescription("No user found")
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

}

exports.conf = {
	category: "Utility",
	name: "Uinfo",
    help: "View information about yourself or another user",
	shortHelp: "View user info",
    format: "k?uinfo {@user}",
    DM: false,
    ownerOnly: false,
    alias: ['userinfo'],
  slashCommand: true
}