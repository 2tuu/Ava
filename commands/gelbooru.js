const Discord = require("discord.js");
var axios = require("axios");

const cooldown = new Set();

//https://gelbooru.com/index.php?page=dapi&s=post&q=index

exports.run = async (client, message, args) => {
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
        
		
			var request = await axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=-loli,${args.slice('loli').join(',')}`);
            
            var parseString = require('xml2js').parseString;
            var xml = request.data
            parseString(xml, function (err, result) {

                var choose = Math.floor(Math.random() * result.posts.post.length);

                /*
                message.channel.send("```"+ 
                "file:" + result.posts.post[choose].$.file_url + "\n" + 
                "source:" + result.posts.post[choose].$.source
                +"```")
                */

                try{

                const embed = new Discord.RichEmbed()
			 .setImage(result.posts.post[choose].$.file_url)
			 .setDescription(`Source: [link](${result.posts.post[choose].$.source})\nPost: [Link](${result.posts.post[choose].$.file_url})`)
			 .setTimestamp()
			 message.channel.send({embed});
                } catch(err){
                    message.channel.send("No results");
                }
                //console.dir(result.posts.post[0].);
            });
			
			 
		}
	

		}

	}


    exports.conf = {
        help: "Pull an image from Gelbooru, a random one will be supplied if no tags are given",
        format: "k?gelbooru {tags}",
        DM: true,
        OwnerOnly: true,
        alias: ['gbooru']
    }
