const Yna = require("ynajs");
exports.run = (client, message, args) => {

var tag = new Yna('{choose:make me;no u;nah;}');

message.channel.send(tag.run());
}

exports.conf = {
    DM: true,
    OwnerOnly: false
}

