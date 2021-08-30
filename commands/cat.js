const Discord = require('discord.js');
const api = require('./../plugins/api.js');

exports.run = async (client, message, args) => {



var action = "cat";
    
        var url = await api.getV(action);
        const embed = new Discord.MessageEmbed()
       .setImage(url.url)
        message.channel.send({embed});
    }
    
    exports.conf = {
        help: "meow",
        format: "k?cats",
        DM: true,
        OwnerOnly: true,
        alias: ['cat']
    }

    //disabled until API replacement