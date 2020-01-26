const Discord = require("discord.js");
const config = require('./../config.json');

exports.run = async (client, message, args) => {
    
    if(config.evalAllow.includes(message.author.id)){


        const embed = new Discord.RichEmbed()
                .setColor(0xF46242)
                .setTimestamp()
                .setTitle("Process restarting...")

               await message.channel.send({embed});
               process.exit(0);

            } else {
                const embed = new Discord.RichEmbed()
                .setColor(0xF46242)
                .setTimestamp()
                .setTitle("You do not have permission to do this. (Bot Owner required)")
                message.channel.send({embed});
                  }

  };
  
  exports.conf = {
    DM: true,
    OwnerOnly: false,
    alias: ['die']
}