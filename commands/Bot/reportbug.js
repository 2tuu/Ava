const Discord = require("discord.js");
const config = require('./../../config.json');

const reportedRecently = new Set();

exports.run = (client, message, args) => {

  if (reportedRecently.has(message.author.id)) {
    let embedVar = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setTitle("Please wait at least 4 hours before reporting another error")
    return client.messageHandler(message, client.isInteraction, { embeds: [embedVar] });
  } else {
    reportedRecently.add(message.author.id);
    setTimeout(() => {reportedRecently.delete(message.author.id)}, 14400000);
  }

  if (!args[0]) return;

  let user = client.users.fetch(config.owner)
    .then(user => {
      var letterAR = ["A", "B", "C", "D"];
      var rand = letterAR[Math.floor(Math.random() * letterAR.length)];

      var errID = `${rand}-${(Math.random()).toString().replace('0.','').substring(-5,5)}-1`;

      const embed1 = new Discord.MessageEmbed()
        .setTitle("Report ID: " + errID)
        .setColor(`0x${client.colors.bad}`)
        .setThumbnail(message.author.avatarURL)
        .addField("From", message.author.id + " (" + message.author.username + "#" + message.author.discriminator + ")")
        .addField("Sent in", message.guild.id + " (" + message.guild.name + ")")
        .addField("Report", args.join(' '))
        .addField("Attachments", ": " + message.attachments.map(e=>e.url))
      user.send({ embeds: [embed1] }).then().catch(console.error);


      var chan = client.channels.cache.get(config.reports);

      const embed2 = new Discord.MessageEmbed()
        .setTitle("Report ID: " + errID)
        .setThumbnail(message.author.avatarURL)
        .addField("From", message.author.username)
        .addField("Sent in", message.guild.name)
        .addField("Report", args.join(' '))
        .addField("Attachments", ": " + message.attachments.map(e=>e.url))
      client.messageHandler(message, client.isInteraction, { embeds: [embed2] }, false, chan);

      let embedVar = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.good}`)
        .setTitle("Error has been reported, make sure to enable DMs on this server so that a follow-up message can be sent.")
      client.messageHandler(message, client.isInteraction, { embeds: [embedVar] });

    }).then().catch(console.error);

}

exports.conf = {
  name: "Report Bug",
  help: "Report a bug to the bot; please include a detailed description of what triggered said bug\nImage attachments will be sent as well\n\nNote: Abuse of this function will result in a ban",
  format: "k?reportbug [description]",
  DM: false,
  ownerOnly: false,
  alias: []
}