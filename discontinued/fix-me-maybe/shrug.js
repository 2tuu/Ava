const Discord = require('discord.js');
const api = require('./../plugins/api.js');

exports.run = async (client, message) => {

var action = "shrug";

        var url = await api.get(action);
        const embed = new Discord.MessageEmbed()
       .setImage(url)
       .setFooter("Powered by KitK.us")
        message.channel.send({embed});
    }
    
    exports.conf = {
        help: "Shrug at the mentioned user",
        format: "k?shrug [@user/name]",
        DM: true,
        OwnerOnly: true,
        alias: []
    }

    //fix when api is fixed