const Discord = require("discord.js");
var axios = require("axios");

const cooldown = new Set();

exports.run = (client, message, args) => {
	if(message.channel.nsfw === false){
		const embed = new Discord.RichEmbed()
		.setTimestamp()
		.setTitle("This command is only available in NSFW channels")
		message.channel.send({embed});
	} else {

		if (cooldown.has(message.author.id)) {
			return message.reply("please wait 5 seconds before using that command again");
		} else {
		cooldown.add(message.author.id);
		setTimeout(() => {
		  cooldown.delete(message.author.id);
		}, 5000);

		async function apiGet(){
			var request = await axios.get(`https://e621.net/post/index.json?tags=-order:random,-gore,${args.join(",")}`);
			
			if(!request.data[0]){
				message.channel.send("No results, make sure you're using less than 6 tags");
			} else {

			var result = request.data[Math.floor(Math.random() * request.data.length)];
			
			const embed = new Discord.RichEmbed()
			 .setImage(result.file_url)
			 .setDescription(`Artist: ${result.artist.join(', ')}\n[link](${result.file_url})`)
			 .setTimestamp()
			 message.channel.send({embed});
			
			}
			 
		}
	
	apiGet();

		}

	}
}

exports.conf = {
    help: "Pull an image from e621",
    format: "k?e621 {tags}",
    DM: true,
    OwnerOnly: true,
    alias: []
}
