const Discord = require("discord.js");

exports.run = (client, message, args, deletedMessage, sql) => {
   

  sql.query(`SELECT * FROM prefixes WHERE serverId ='${message.guild.id}'`).then(row => {
    row = row.rows;

    if(!row[0]){
      var prefix = "k?";
    } else {
      var prefix = row[0].prefix;
    }

    const embed = new Discord.MessageEmbed()
      .setTimestamp()
      .setTitle("This server: " + prefix)
    message.channel.send({embed});
  });
    
       
}

exports.conf = {
  name: "Checkprefix",
  help: "View this server's prefix",
  format: "k?checkprefix / @kit checkprefix",
  DM: false,
  OwnerOnly: false,
  alias: []
}