const config = require("./../config.json");
const Discord = require('discord.js');

exports.run = (client, message, args) => {
  if(!message.author.id === config.owner && !message.author.id === "454461184792461312"){
    return;
  } else {

    if(!args || args.size < 1) return;
    delete require.cache[require.resolve(`./${args[0]}.js`)];

    let embedVar = new Discord.RichEmbed()
           .setTimestamp()
           .setDescription(`The module \`${args[0]}\` has been reloaded`)
           message.channel.send({embed: embedVar});

  }
  }
  
  exports.conf = {
    DM: true,
    OwnerOnly: false
}