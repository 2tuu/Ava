const Discord = require("discord.js");
var axios = require("axios");
const cooldown = new Set();
const config = require("./../config.json");

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
			var request = await axios.get(`https://e621.net/posts.json?limit=5&tags=order:random+-cub+-gore+${args.join("+")}`);
			//console.log(request.data.posts);

			if(!request.data.posts[0]){
				message.channel.send("No results, make sure you're using less than 4 tags");
			} else {
			var result = request.data.posts[0];
			
			const embed = new Discord.RichEmbed()
			 .setImage(result.file.url)
			 .setDescription(`Artist: ${result.tags.artist.join(', ')}\n[link](https://e621.net/posts/${result.id})`)
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
    DM: false,
    OwnerOnly: false,
    alias: []
}
