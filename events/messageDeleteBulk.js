exports.run = async (deletedMessage, sql, client, messages) => {

   var messagesAr = messages.map(m => `${m.author.tag} (${m.id}): ${m.content} | Attachments: ${m.attachments.array().map(g=>g.url).join(', ')}`);
   var messageBuf = 'Tag (Message ID): Content | Attachments: [Link to attachments if any]\r\n' + messagesAr.join('\r\n');
   var buf = Buffer.from(messageBuf, 'utf8');

    try{
        var message = messages.array();
        var guildID = message[0].guild.id;
        } catch(err){
            console.error(err);
        }
    
        var row = await sql.get(`SELECT * FROM modlog WHERE serverId ="${guildID}"`);

    
            if(!row) return;
    
            if(row.enabled === "yes" && row.logMessages === "yes"){
               var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);

               ch.send("```diff\n-Message Mass Deletion: Contents stored in the following text file\n```", {
                files: [
                    {
                        attachment: buf,
                        name: 'log.txt'
                      }
                ]
              });
            }
    

}