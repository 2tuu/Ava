const Discord = require("discord.js");
var axios = require("axios");

exports.run = (client, message, args) => {
	if(message.channel.nsfw === false){
		const embed = new Discord.RichEmbed()
		.setTimestamp()
		.setTitle("This command is only available in NSFW channels")
		message.channel.send({embed});
	} else {
	async function apiGet(){
		var request = await axios.get("http://inspirobot.me/api?generate=true");
		console.log("INSP: " + request.data);

		const embed = new Discord.RichEmbed()
		 .setImage(request.data)
		 .setFooter("Powered by Inspirobot")
		 .setTimestamp()
	 	message.channel.send({embed});
	}
apiGet();
	}
}

exports.conf = {
    DM: true,
    OwnerOnly: false
}