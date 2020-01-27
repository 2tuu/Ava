const Yna = require("ynajs");
exports.run = (client, message, args) => {

var tag = new Yna('{choose:make me;no u;nah;}');

message.channel.send(tag.run());
}

exports.conf = {
    help: "nah",
    format: "N/A",
    DM: true,
    OwnerOnly: false,
    alias: []
}

