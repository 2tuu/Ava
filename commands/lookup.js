const Discord = require("discord.js");


exports.run = (client, message, args) => {
	let userID = message.author.id;

	//Find by mention
	if(args.join(' ').startsWith("<@") || args.join(' ').startsWith("<!@")){
	userID = args[0];
	userID = userID.replace("<@", "");
	userID = userID.replace("<@!", "");
	userID = userID.replace(">", "");
	userID = userID.replace("!", "");
	} else if(!args[0]){
		userID = message.author.id;
	} else if(args[0].match(/^\d/)){
		userID = args[0];
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

	client.fetchUser(userID).then((member) => {

		if(!member) return;

		//console.log(member);

		if(!member.avatarURL){
			var thumbnailVar = "https://www.kitk.us/image/discord.png";
		} else {
			var thumbnailVar = member.avatarURL;
		}

		//console.log(member);
		var gDate = new Date(userID /4194304 + 1420070400000);
		var lUsername = `${member.username}#${member.discriminator}`;

		if(member.bot){
			lUsername = lUsername + ' <:botTag:230105988211015680>';
		}

		const embed = new Discord.RichEmbed()
				.setAuthor(`User Lookup`, `${message.author.avatarURL}`)
				.setThumbnail(`${thumbnailVar}`)
				.addField("Username", `${lUsername}`)
				.addField("User ID", `${member.id}`)
				.addField("Account Age", dhm((Date.parse(new Date(userID /4194304 + 1420070400000))) - Date.now()).replace("-", "") + `\nCreated: ${gDate}`)
				message.channel.send({embed});

	});
}

exports.conf = {
    DM: true,
    OwnerOnly: false
}