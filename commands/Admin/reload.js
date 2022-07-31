const config = require("./../../config.json");
const Discord = require('discord.js');

exports.run = (client, message, args) => {
  var cmd = args[0].toLowerCase();
  if (!args || args.size < 1) return;
  try {
    delete require.cache[require.resolve(`./../${client.help[cmd].category}/${cmd}.js`)];
  } catch (err) {
    try {
      delete require.cache[require.resolve(`./../../commands-locked/${cmd}.js`)];
    } catch (err) {
      return client.messageHandler(message, client.isInteraction, 'Can\'t: \n```js' + err + '\n```');
    }
  }
  console.log('Reloaded module: ' + args[0]);

  let embedVar = new Discord.MessageEmbed()
    .setColor(`0x${client.colors.neutral}`)
    .setDescription(`The module \`${args[0]}\` has been reloaded`)
  client.messageHandler(message, client.isInteraction, { embeds: [embedVar] })
}

exports.conf = {
  name: "N/A (dev command)",
  help: "N/A",
  format: "N/A",
  DM: true,
  ownerOnly: true,
  alias: ['r']
}