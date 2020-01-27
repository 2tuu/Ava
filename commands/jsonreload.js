const config = require("./../config.json");
const Discord = require('discord.js');

exports.run = (client, message, args) => {
    if(!args || args.size < 1) return;
    delete require.cache[require.resolve(`./../JSON/${args[0]}.json`)];

    let embedVar = new Discord.RichEmbed()
           .setTimestamp()
           .setDescription(`The JSON \`${args[0]}.json\` has been reloaded`)
           message.channel.send({embed: embedVar});

  
  }
  
  exports.conf = {
    help: "N/A",
    format: "N/A",
    DM: true,
    OwnerOnly: true,
    alias: []
}