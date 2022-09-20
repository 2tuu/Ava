const Discord = require("discord.js");

exports.run = (client, message, args, deletedMessage, sql) => {
  sql.query(`SELECT * FROM prefixes WHERE serverId ='${message.guild.id}'`).then(row => {
    row = row.rows;

    if (!row[0]) {
      var prefix = "k?";
    } else {
      var prefix = row[0].prefix;
    }

    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.good}`)
      .setTitle("This server: " + prefix)
    client.messageHandler(message, client.isInteraction, { embeds: [embed] })
  });
}

exports.conf = {
  name: "Checkprefix",
  help: "View this server's prefix",
  format: "k?checkprefix / @kit checkprefix",
  DM: false,
  ownerOnly: false,
  alias: [],
  slashCommand: true,
  data: {
    name: "checkprefix",
    description: "Check this server's prefix",
    options: [
    ],
    dm_permission: false
  }
}