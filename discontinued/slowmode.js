//thanks ratismal

const config = require("./../config.json");
//const Eris = require('eris');
//var bot = new Eris(config.token);

const axios = require('axios');

exports.run = (client, message, args) => {

function slowmode(s, m){
    axios({
        method: 'patch',
        url: `https://discordapp.com/api/v6/channels/${message.channel.id}`,
        headers: {
            "Authorization" : `Bot ${config.token}`
          },
        data: {
            rate_limit_per_user: s,
            reason: args.slice(1).join(" ")
        }
      }).then(message.channel.send(m))
      .catch((err) =>{
          message.channel.send("An error occured, make sure I have permission to do this:\n```js\n" + err + "\n```");
      });
}


if(!message.member.permissions.has('KICK_MEMBERS')) {
    const embed = new Discord.MessageEmbed()
    .setColor(0xF46242)
    .setTimestamp()
    .setTitle("Sorry, you don't have permission to use this.")
    message.channel.send({embed});
    return;
} else {
        
        if(args[0] === "off"){
            slowmode(0, "Slow Mode Disabled");
        } else if(isNaN(args[0]) || parseInt(args[0]) > 120 || parseInt(args[0]) < 1){
            message.channel.send("Please use a number between 1 and 120");
        } else {
            slowmode(args[0], `Slow Mode set to ${args[0]} seconds`);
        }


    }

}

exports.conf = {
    help: "Enable slowmode in this channel",
    format: "k?slowmode [off/1-120 seconds]",
    DM: false,
    OwnerOnly: true,
    alias: []
}

//Endpoint returns 401, figure out a better way of doing this