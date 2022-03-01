const ySearch =  require('yt-search');
const config = require('./../config.json');

const Discord = require("discord.js"); 

exports.run = (client, message, args) => {
  var searchTerms;

  if(args[0]){
    searchTerms = args.join(' ');
  } else {
    return client.messageHandler(message, client.isInteraction, 'Please give me something to look for')
  }

  ySearch( searchTerms, function ( err, r ) {
    if ( err ) return client.messageHandler(message, client.isInteraction, 'An error occured:\n```js' + err + '```');

    const videos = r.videos

    if(videos[0]){
      var v = videos[0];
      const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setDescription(`**${v.title}**`)
      if(!client.isInteraction){
        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
      }
      client.messageHandler(message, client.isInteraction, `${v.url}`);
    } else {
      client.messageHandler(message, client.isInteraction, 'No results.');
    }
  });
}
    
exports.conf = {
  category: "Fun",
  name: "Youtube",
  help: "Search youtube for something",
  shortHelp: "Youtube search",
  format: "k?youtube [search terms]",
  DM: true,
  ownerOnly: false,
  alias: ['yt'],
  slashCommand: true
}