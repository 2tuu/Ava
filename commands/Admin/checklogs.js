const Discord = require("discord.js");
const fs = require(`fs`);

exports.run = async (client, message) => {
  fs.readdir("./logs/", function (err, files) {
    var logs = [];
    files = files.map(function (fileName) {
      return {
        name: fileName,
        time: fs.statSync('./logs/' + fileName).mtime.getTime()
      };
    }).sort(function (a, b) { return a.time - b.time; }).map(function (v) { logs.push(v.name); });

    logs = logs.filter(e => (e.endsWith('.log')));
    logs = logs.filter(e => (!e.startsWith('._')));
    logs = logs.reverse();

    fs.readFile(`./logs/${logs[0]}`, (error, data) => {
      if (error) {
        return console.error(error);
      }

      var buf = Buffer.from(('LAST LOG:\n\n' + data.toString()), 'utf8');

      message.channel.send({
        files: [
          {
            attachment: buf,
            name: logs[0]
          }
        ]
      });
    });

  })
}

exports.conf = {
  name: "N/A (dev command)",
  help: "Not for you",
  format: "k?info",
  DM: true,
  ownerOnly: true,
  alias: ['logs']
}