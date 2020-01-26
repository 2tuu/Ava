//run yadda yada
const accents = require('remove-accents');
var latinize = require('latinize');
var unidecode = require('unidecode');

exports.run = (client, message, args) => {
    var v = args.join(' ');
    
    //if(v.length >= 700) return message.channel.send("What's this? (ERR: Too many characters, use 700 or less)");
    
    let owoify = function (v) {

        v = v.replace(/[^a-z]/gi, '');
        v = v.toUpperCase();

        v = v.split('');

        v.forEach(str => {
            str.replace(str, `:comic${str}:`)
        });

        v = v.join('');

        v = v.replace(/\[A-Z]/g, /\:comic[A-Z]:/g);
      
        return v;
      
      }
    
      if(!args[0]){
          return message.channel.send("Whats this? (ERR: No arguments)")
      }
    
      message.channel.send(owoify(v));
    }
    
    exports.conf = {
        DM: true,
        OwnerOnly: false
    }