const fs = require("fs");

exports.run = (client, message, args) => {

    var current;

    fs.readFile('./../WWW/bot/data/ann.txt', function(err, buf) {
        current = buf.toString();
      });

      var data = "<b>" + Date(Date.now()) + ": </b>" + args.join(' ');

      fs.appendFile('./../WWW/bot/data/ann.txt', "\n" + data, function(err, data){
          if (err) console.log(err);
          message.channel.send("Updated")
      });

}

exports.conf = {
    DM: false,
    OwnerOnly: false
}