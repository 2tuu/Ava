const Discord = require('discord.js');
const api = require('./../plugins/api.js');

exports.run = async (client, message, args) => {

var action = "loss";

        var url = await api.get(action);
        const embed = new Discord.RichEmbed()
       .setImage(url)
       .setFooter("Powered by KitK.us")
        message.channel.send({embed});
    }
    
exports.conf = {
    DM: true,
    OwnerOnly: false
}
