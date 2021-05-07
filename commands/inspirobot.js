const Discord = require("discord.js");
var axios = require("axios");

exports.run = async (client, message, args) => {
		var request = await axios.get("http://inspirobot.me/api?generate=true");
		const embed = new Discord.MessageEmbed()
		 .setImage(request.data)
		 .setFooter("Powered by Inspirobot")
		 .setTimestamp()
	 	message.channel.send({embed});
}

exports.conf = {
    help: "Generate an image from insprobot.me",
    format: "k?inspirobot",
    DM: true,
    OwnerOnly: false,
    alias: []
}