const Discord = require("discord.js");
const cooldown = new Set();

const booru = require('booru');

const taglimit = 2;

exports.run = (client, message, args) => {

	try{

        if(args.length > taglimit){
            const embed = new Discord.MessageEmbed()
		        .setTimestamp()
		        .setTitle("This site has a limit of " + taglimit + " tags.")
		    return message.channel.send({embed});
        }
    
	    if(message.channel.nsfw === false){
		    const embed = new Discord.MessageEmbed()
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
	    }

		  async function grab(tags){

			  var result = await booru.search('danbooru', tags, { limit: 10, random: true })
			  //found commonly disturbing or against discord's content rules
        var blacklist = [
				  "cub",
				  "scat",
				  "watersports",
				  "gore",
				  "loli",
				  "shota",
				  "flash"
			  ];

        result.posts = result.posts.filter(r => !r.tags.some(e=> blacklist.indexOf(e) >= 0)); //Tag blacklist handler

        if(result.posts[0]){
          var url = result.posts[0].fileUrl;
          var source = result.posts[0].source;

		  if(!source){
			  source = 'No Source Supplied';
		  } else {
			  source = '[Source](' + source + ')';
		  }

          const embed = new Discord.MessageEmbed()
			      .setImage(url)
			      .setDescription(`${source}`)
			      .setTimestamp()
			    message.channel.send({embed});

          //console.log(result.posts[0]);
        } else {
          message.channel.send('No results.');
        }
		  }

      var tags = [];

      if(args[0]){
        tags = args;
      }

		  grab(tags);
	
 	}

	}catch(err){
		console.error(err);
	}
	
}

exports.conf = {
    help: "Pull an image from e621",
    format: "k?e621 {tags}",
    DM: false,
    OwnerOnly: false,
    alias: []
}
