const config = require("./../../config.json");
const Discord = require("discord.js");
const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./plugins/data.json", "utf8"));

exports.run = (client, message, args) => {
  var message2 = args.join(" ");
  data.status = message2;
  const embed = new Discord.MessageEmbed()
    .setTitle("Bot status changed: " + data.status)
  client.messageHandler(message, client.isInteraction, { embeds: [embed] });

  fs.writeFile("./plugins/data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) console.error(err)
  });

  client.user.setActivity(message2);
  console.log("Status changed: " + args.join(" "));
}

exports.conf = {
  name: "N/A (dev command)",
  help: "N/A",
  format: "N/A",
  DM: true,
  ownerOnly: true,
  alias: []
}