const config = require('./../config.json');

exports.run = (client, message, args) => {
message.channel.send("Tell kab to fix this");
}

exports.conf = {
    help: "Print out my invite",
    format: "k?invite",
    DM: true,
    OwnerOnly: false,
    alias: []
}