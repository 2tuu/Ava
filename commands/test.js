const Discord = require("discord.js");
const tag = require('./../plugins/tag.js');

exports.run = (client, message, args) => {

    function getSeconds(str) {
        var seconds = 0;
        var days = str.match(/(\d+)\s*d/);
        var hours = str.match(/(\d+)\s*h/);
        var minutes = str.match(/(\d+)\s*m/);
        if (days) { seconds += parseInt(days[1])*86400; }
        if (hours) { seconds += parseInt(hours[1])*3600; }
        if (minutes) { seconds += parseInt(minutes[1])*60; }
        return seconds * 1000;
      }

    var time = getSeconds(args.join(' '));
    message.channel.send(time);

}

exports.conf = {
    DM: false,
    OwnerOnly: false
}