const Discord = require("discord.js");

exports.run = (client, message, args, deletedMessage, pool) => {

  if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['prefix'].help)
			.addField("Usage", '```' + client.help['prefix'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

  pool.query(`SELECT * FROM prefixes WHERE serverId ='${message.guild.id}'`).then(row => {
    row = row.rows;
    if (!row[0]) {
      sql.query(`INSERT INTO prefixes (prefix, welcomeMessage, welcomeChannel, shouldWelcome, serverId) VALUES ('k?', 'This is a placeholder', 'null', 'false', '${message.guild.id}')`);
    }

    if (message.member.permissions.has('ADMINISTRATOR')) {
      pool.query(`UPDATE prefixes SET prefix = '${args[0].replace("\"", "").replace("\"", "")}' WHERE serverId = '${message.guild.id}'`);

      const embed = new Discord.MessageEmbed()
        .setTitle("Server prefix changed to: \"" + args[0].replace("\"", "").replace("\"", "") + "\"")
      client.messageHandler(message, client.isInteraction, { embeds: [embed] });

      console.log('\x1b[36m%s\x1b[0m', "Server prefix for GUILD ID: " + message.guild.id);
      console.log('\x1b[36m%s\x1b[0m', "Changed to: " + args[0]);

    } else {
      const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setTitle("You do not have permission to do this. (Administrator required)")
      client.messageHandler(message, client.isInteraction, { embeds: [embed] });

    }


  }).catch(() => {
    console.error;
  });

}

exports.conf = {
  name: "Prefix",
  help: "Set my prefix to be used in this server",
  format: "k?prefix [prefix]\nie. k?prefix ! <- makes the command structure !<command> instead of k?<command>",
  DM: false,
  ownerOnly: false,
  alias: ['setprefix']
}