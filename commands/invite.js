const config = require('./../config.json');

exports.run = (client, message, args) => {
message.channel.send("Invite me to your server: " + config.invite);
}

exports.conf = {
    DM: true,
    OwnerOnly: false,
    alias: []
}