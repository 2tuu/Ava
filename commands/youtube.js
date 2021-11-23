const ySearch =  require('yt-search');
const config = require('./../config.json');

const Discord = require("discord.js"); 

exports.run = (client, message, args) => {
  var searchTerms;

  if(args[0]){
    searchTerms = args.join(' ');
  } else {
    return message.channel.send('Please give me something to look for')
  }

  ySearch( searchTerms, function ( err, r ) {
    if ( err ) return message.channel.send('An error occured:\n```js' + err + '```');

    const videos = r.videos

    if(videos[0]){
      var v = videos[0];
      const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setDescription(`**${v.title}**`)
      message.channel.send({embed});
      message.channel.send(`${v.url}`);
    } else {
      message.channel.send('No results.');
    }
  });
}
    
exports.conf = {
  category: "Fun",
  name: "Youtube",
  help: "Search youtube for something",
  format: "k?youtube [search terms]",
  DM: true,
  OwnerOnly: false,
  alias: ['yt']
}