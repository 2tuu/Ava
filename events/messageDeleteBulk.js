const Discord = require(`discord.js`);
exports.run = async (deletedMessage, sql, client, messages) => {

   var messagesAr = [];
   var channelID;

   messages.forEach(m => {

    channelID = m.channel.id;

    if(!m.attachments.array()[0]){
      messagesAr.push({
        "content": `${client.timeCon(m.createdTimestamp)} ${m.author.tag} (${m.id}): ${m.content}`,
        "time": m.createdTimestamp
      });
    } else {
      messagesAr.push({
        "content": `${client.timeCon(m.createdTimestamp)} ${m.author.tag} (${m.id}): ${m.content} | Attachments: ${m.attachments.array().map(g=>g.url).join(', ')}`,
        "time": m.createdTimestamp
      });
    }

    messagesAr.sort(function(a, b) {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      return 0;
    });



   })


   var messageBuf = 'Tag (Message ID): Content | Attachments: [Link to attachments if any]\r\n' + messagesAr.map(b=>b.content).join('\r\n');
   var buf = Buffer.from(messageBuf, 'utf8');

    try{
        var message = messages.array();
        var guildID = message[0].guild.id;
        } catch(err){
            console.error(err);
        }
    
        var row = await sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`);
            row = row.rows[0];
    
            if(!row) return;
            if(row.ignore.split(',').includes(channelID)) return;
    
            if(row.enabled === "yes" && row.logmessages === "yes"){
               var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);

               ch.send("```diff\n-Message Mass Deletion (Channel: " + channelID + "): Contents stored in the following text file\n```", {
                files: [
                    {
                        attachment: buf,
                        name: 'log.txt'
                      }
                ]
              });
            }
    

}