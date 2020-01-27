const Discord = require('discord.js');
const api = require('./../plugins/api.js');

exports.run = async (client, message, args) => {

var action = "shrug";

        var url = await api.get(action);
        const embed = new Discord.RichEmbed()
       .setImage(url)
       .setFooter("Powered by KitK.us")
        message.channel.send({embed});
    }
    
    exports.conf = {
        help: "Shrug at the mentioned user",
        format: "k?shrug [@user/name]",
        DM: true,
        OwnerOnly: false,
        alias: []
    }