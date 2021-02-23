const birb = require('birb');
const Discord = require('discord.js');

exports.run = (client, message, args) => {

    birb.random()
      .then(url => {
        let embedVar = new Discord.MessageEmbed()
           .setImage(url)
           .setTimestamp()
           .setFooter("Powered by Random.Birb.Pw")
           message.channel.send({embed: embedVar}); //NAMING SCHEME - /loss/#.jpg <- MUST BE JPG
        console.log('Bird: ' + url);
     });
    
    }
    
    exports.conf = {
      help: "view a bird",
      format: "k?birb",
      DM: true,
      OwnerOnly: true,//TODO: Find a new API or make your own
      alias: ['bird']
  }