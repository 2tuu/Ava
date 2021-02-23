const Discord = require("discord.js");
var axios = require("axios");

exports.run = (client, message, args) => {
	async function apiGet(){
		var request = await axios.get("http://inspirobot.me/api?generate=true");
		console.log("INSP: " + request.data);

		const embed = new Discord.MessageEmbed()
		 .setImage(request.data)
		 .setFooter("Powered by Inspirobot")
		 .setTimestamp()
	 	message.channel.send({embed});
	}
apiGet();
	
}

exports.conf = {
    help: "Generate an image from insprobot.me",
    format: "k?inspirobot",
    DM: true,
    OwnerOnly: false,
    alias: []
}