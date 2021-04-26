const Discord = require("discord.js");

exports.run = (client, message, args) => {

if(args[0]){
    message.channel.send(args.join(' '));
}

}

exports.conf = {
    help: "Not for you",
    format: "N/A",
    DM: true,
    OwnerOnly: true,
    alias: []
}
