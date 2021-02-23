const Discord = require('discord.js');
const api = require('./../plugins/api.js');

exports.run = async (client, message, args) => {

var action = "dab";

        var url = await api.get(action);
        const embed = new Discord.MessageEmbed()
       .setImage(url)
       .setFooter("Powered by KitK.us")
        message.channel.send({embed});
    }
    
    exports.conf = {
        help: "Dab",
        format: "k?dab",
        DM: true,
        OwnerOnly: true,
        alias: []
    }

    //probably delete this, unless I can remake the api
