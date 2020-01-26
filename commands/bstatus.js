//thanks ratismal

const config = require("./../config.json");
//const Eris = require('eris');
//var bot = new Eris(config.token);

const axios = require('axios');

/*
{"token":"TOKEN","events":[{"type":"custom_status_updated","properties":{"client_track_timestamp":1576545180388,"emoji_type":null,"text_len":13,"clear_after":"TODAY","location_section":"Account Panel","location_object":"Avatar","accessibility_support_enabled":false,"client_uuid":"AwCEjv6oQQViv/I92sJnEW8BAAAMAAAA","client_send_timestamp":1576545180409}}]}
*/

exports.run = (client, message, args) => {


function status(s, m){
    axios({
        method: 'patch',
        url: `https://discordapp.com/api/v6/users/@me/settings`,
        headers: {
            "Authorization" : `Bot ${config.token}`
          },
        data: {
			"custom_status":{"text":"test status"}
        }
      }).then(message.channel.send(m))
      .catch((err) =>{
          message.channel.send("ERR: " + err);
      });
}

status();

}

exports.conf = {
    DM: true,
    OwnerOnly: false,
    alias: []
}