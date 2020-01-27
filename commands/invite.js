const config = require('./../config.json');

exports.run = (client, message, args) => {
message.channel.send("Invite me to your server: " + config.invite);
}

exports.conf = {
    help: "Print out my invite",
    format: "k?invite",
    DM: true,
    OwnerOnly: false,
    alias: []
}