const Discord = require('discord.js');

exports.run = async (client, message, args) => {

	try{


    if(!args[0]){
        var searchUser = await message.guild.members.fetch(message.author.id);
    } else {
		var id = args[0].replace('<@', '').replace('>', '').replace('!', '');
		console.log(id);
		var searchUser = await message.guild.members.fetch(id);
	}

	function dhm(t){
		var cd = 24 * 60 * 60 * 1000,
			ch = 60 * 60 * 1000,
			d = Math.floor(t / cd),
			h = Math.floor( (t - d * cd) / ch),
			m = Math.round( (t - d * cd - h * ch) / 60000),
			pad = function(n){ return n < 10 ? '0' + n : n; };
	  if( m === 60 ){
		h++;
		m = 0;
	  }
	  if( h === 24 ){
		d++;
		h = 0;
	  }
	  return [d, pad(h), pad(m)].join(':');
	}

	var age = dhm((message.createdTimestamp) - (searchUser.joinedTimestamp));
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
	//return console.log('roles: ' + searchUser._roles);

	
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
			+ "\n**Time since join:** " + age
			+ "\n**Account Age:** " + dhm((Date.parse(new Date(searchUser.id /4194304 + 1420070400000))) - Date.now()).replace("-", "")
			+ "\n \n**Roles:**\n" + roleList)
			message.channel.send({embed});

	}catch(err){
		const embed = new Discord.MessageEmbed()
		.setColor(0xF46242)
		.setDescription("No user found")
		return message.channel.send({embed});
	}

}

exports.conf = {
	category: "Utility",
	name: "Uinfo",
    help: "",
    format: "",
    DM: false,
    OwnerOnly: false,
    alias: ['userinfo']
}