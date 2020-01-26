//search
var search = require('youtube-search');
const config = require('./../config.json');

exports.run = (client, message, args) => {
    
    var term = args.join(' ')
    var opts = {
      maxResults: 1,
      key: config.youtube //Youtube API key
    };
    
    //Search
    search(term, opts, function(err, results) {
      if(err) return console.log(err);
    
    var videoResult = JSON.stringify(results[0].link);
        videoResult = videoResult.replace('"',"");
        videoResult = videoResult.replace('"',"");
        console.log("RESULT " + videoResult);
    
        videoTitle = JSON.stringify(results[0].title);
        videoTitle = videoTitle.replace('"',"");
        videoTitle = videoTitle.replace('"',"");
        /*const embed = new Discord.RichEmbed()
          .setColor(0x00AE86)
          .setTimestamp()
          .setTitle("Youtube Video search: " + videoTitle)
        message.channel.send({embed});*/
        
    if(!results[0]){
    videoResult = "Video not found";
    }    
    message.channel.send(videoResult);
    });
    }
    
    exports.conf = {
      DM: true,
      OwnerOnly: false
  }