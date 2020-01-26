const Discord = require('discord.js');

exports.run = (client, message, args, deletedMessage, sql) => {

sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {
    if(!row){
  
      //sql.run("INSERT INTO profile (userId, quarters, badge, desc, color, cmds) VALUES (?, ?, ?, ?, ?, ?)", [message.author.id, "4", "490747106278244353", "Not set", "#fa6969", 0]);
      const embed = new Discord.RichEmbed()
      .setColor(0xF46242)
      .setDescription("You don't have a profile")
      .setFooter("Use k?profile create")
      return message.channel.send({embed});
  
    } else {
  
      const embed = new Discord.RichEmbed()
      .addField("Points", Math.floor(row.cmds))
      .addField("Level", `${Math.floor(0.1 * Math.sqrt(cmds + 1))}`)
      return message.channel.send({embed});
      
    }
  });

}

exports.conf = {
    DM: true,
    OwnerOnly: false
}