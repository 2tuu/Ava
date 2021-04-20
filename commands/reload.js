const config = require("./../config.json");
const Discord = require('discord.js');

exports.run = (client, message, args) => {
  if(!message.author.id === config.owner && !message.author.id === "454461184792461312"){
    return;
  } else {

    if(!args || args.size < 1) return;
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    console.log('Reloaded module: ' + args[0]);

    let embedVar = new Discord.MessageEmbed()
           .setTimestamp()
           .setDescription(`The module \`${args[0]}\` has been reloaded`)
           message.channel.send({embed: embedVar});

  }
  }
  
  exports.conf = {
    help: "N/A",
    format: "N/A",
    DM: true,
    OwnerOnly: true,
    alias: ['r']
}