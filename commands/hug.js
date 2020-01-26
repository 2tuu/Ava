const Discord = require('discord.js');
const api = require('./../plugins/api.js');

exports.run = async (client, message, args) => {



var action = "hug";

	if(!args[0]){
		const embed = new Discord.RichEmbed()
		.setTimestamp()
		.setTitle("This command requires an argument")
		return message.channel.send({embed});
        }
    
        try{
        var u = client.fetchUser(args[0].replace('<@', "").replace(">", "").replace("!", "")).catch();
        }
        catch (err){
            var u;
        }
    if(u.username == undefined){
        var nameVar = args.join(' ');     
    } else {
        var nameVar = u.username;
    }
        var url = await api.getV(action);
        const embed = new Discord.RichEmbed()
       .setDescription(message.author.username + " gave " + nameVar + " a " + action)
       .setImage(url.url)
       .setFooter("Powered by KitK.us | " + url.name)
        message.channel.send({embed});
    }
    
exports.conf = {
    DM: true,
    OwnerOnly: false
}