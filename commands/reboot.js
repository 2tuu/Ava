const Discord = require("discord.js");
const config = require('./../config.json');

exports.run = async (client, message) => {
        const embed = new Discord.RichEmbed()
                .setColor(0xF46242)
                .setTimestamp()
                .setTitle("Process restarting...")

               await message.channel.send({embed});
               process.exit(0);

  };
  
  exports.conf = {
    help: "N/A",
    format: "N/A",
    DM: true,
    OwnerOnly: true,
    alias: ['die']
}