//search
//var search = require('youtube-search');
const ySearch =  require('yt-search');
const config = require('./../config.json');

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
      message.channel.send( `**${v.title}:** ${v.url}`);
    } else {
      message.channel.send('No results.');
    }
  });


}
    
exports.conf = {
  help: "Search youtube for something",
  format: "k?youtube [search terms]",
  DM: true,
  OwnerOnly: false,
  alias: ['yt']
}