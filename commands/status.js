const config = require("./../config.json");
const Discord = require("discord.js");
const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));

exports.run = (client, message, args) => {
  if(config.evalAllow.includes(message.author.id)){
    var message2 = args.join(" ");
    data.status = message2;
    const embed = new Discord.MessageEmbed()
      .setTitle("Complete bot status changed: " + data.status)
    message.channel.send({embed});

    fs.writeFile("./JSON/data.json", JSON.stringify(data, null, 2), (err) => {
      if (err) console.error(err)
    });

    client.user.setActivity(message2);
    console.log("Status changed: " + args.join(" "));
  } else {
  const embed = new Discord.MessageEmbed()
    .setColor(`0x${client.colors.bad}`)
    .setTitle("You do not have permission to do this. (Bot Owner required)")
  message.channel.send({embed});
  }
}

exports.conf = {
  category: "Admin",
  name: "N/A (dev command)",
  help: "N/A",
  format: "N/A",
  DM: true,
  OwnerOnly: true,
  alias: []
}