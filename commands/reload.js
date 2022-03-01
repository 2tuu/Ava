const config = require("./../config.json");
const Discord = require('discord.js');

exports.run = (client, message, args) => {
  if(!message.author.id === config.owner && !message.author.id === "454461184792461312"){
    return;
  } else {

    if(!args || args.size < 1) return;
    try{
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    } catch (err) {
      try{
        delete require.cache[require.resolve(`./../commands-locked/${args[0]}.js`)];
      } catch(err){
        return client.messageHandler(message, client.isInteraction, 'Can\'t: \n```js' + err + '\n```');
      }
    }
    console.log('Reloaded module: ' + args[0]);

    let embedVar = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.neutral}`)
      .setDescription(`The module \`${args[0]}\` has been reloaded`)
      client.messageHandler(message, client.isInteraction, { embeds: [embedVar] })

  }
}
  
exports.conf = {
  category: "Admin",
   name: "N/A (dev command)",
    help: "N/A",
    shortHelp: "[N/A]",
    format: "N/A",
    DM: true,
    ownerOnly: true,
    alias: ['r']
}