const Discord = require(`discord.js`);
exports.run = async (deletedMessage, sql, client, messages) => {

  var messagesAr = [];
  var channelID;

  messages.forEach(m => {
    channelID = m.channel.id;

    if (!m.attachments) {
      messagesAr.push({
        "content": `${client.timeCon(m.createdTimestamp)} ${m.author.tag} (${m.id}): ${m.content}`,
        "time": m.createdTimestamp
      });
    } else {
      messagesAr.push({
        "content": `${client.timeCon(m.createdTimestamp)} ${m.author.tag} (${m.id}): ${m.content} | Attachments: ${m.attachments.map(g => g.url).join(', ')}`,
        "time": m.createdTimestamp
      });
    }

    messagesAr.sort(function (a, b) {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      return 0;
    });
  })


  var messageBuf = 'Tag (Message ID): Content | Attachments: [Link to attachments if any]\r\n' + messagesAr.map(b => b.content).join('\r\n');
  var buf = Buffer.from(messageBuf, 'utf8');

  try {
    var message = messages.first();
    var guildID = message.guild.id;
  } catch (err) {
    console.error(err);
  }

  var row = await sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`);
  row = row.rows[0];

  if (!row) return;
  if (row.ignore.split(',').includes(channelID)) return;

  if (row.enabled === "yes" && row.logmessages === "yes") {
    var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);

    const embed = new Discord.MessageEmbed()
    .setColor(`0x${client.colors.bad}`)
    .setDescription("```diff\n-Mass Message Deletion:\n```")
    ch.send({ embeds: [embed] });
    ch.send({
      files: [
        {
          attachment: buf,
          name: 'log.txt'
        }
      ]
    });
  }
}