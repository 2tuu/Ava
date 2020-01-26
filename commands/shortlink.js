
exports.run = async (client, message, args) => {

    var conf = require('./../config.json');
    //var token = 'fiDSpgTvCV%gmf_rjcPemF';
    console.log(conf);
    var token = conf.shortlink_token;

    const axios = require('axios');

    if(!args[0].match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) return message.channel.send("Invalid link, please use `https://* or http//:*` format");

    var request = await axios.get(`https://i.kitk.us/s/upload.php`, {
    headers: {
        "Authorization" : `${token}`,
        "input": `${args[0]}`
      }
  });
        var final = request.data;
        //console.log(request);

        message.channel.send('Link `' + final + '`');

    }
    
    exports.conf = {
        DM: false,
        OwnerOnly: false
    }
    