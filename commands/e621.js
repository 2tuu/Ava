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
			var request = await axios.get(`https://e621.net/posts.json?limit=15&tags=order:random+${args.join("+")}`);
			/*
			Tags against ToS or hidden by E621 by default
			Also includes tags found disturbing by the majority of users
			+ flash posts
			*/
			var blacklist = [
				"cub",
				"scat",
				"watersports",
				"gore",
				"loli",
				"shota",
				"flash"
			];
			/*
			File types that don't embed properly or at all
			*/
			var fTypeBlacklist = [
				"webm",
				"swf",
				"mp4"
			];

			var results = request.data.posts;
			//console.log(results[0].file.ext);
			var filterLogic = `'${blacklist.join("'||'")}'`; //ugly but functional
			var fileFilterLogic = `'${fTypeBlacklist.join("'||'")}'`;
			
			var final = results.filter(r => !r.tags.general.some(e=> blacklist.indexOf(e) >= 0)); //Tag blacklist handler
			final = results.filter(r => fTypeBlacklist.indexOf(r.file.ext) === -1); //File type blacklist handler

			if(!final[0]){
				message.channel.send("No results, make sure you're using less than 6 tags");
			} else {
			var result = final[0];
			
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
    DM: true,
    OwnerOnly: false,
    alias: []
}
