exports.run = (deletedMessage, sql, client, messageReaction, user) => {

    try{
        var guildID = messageReaction.message.guild.id;
        } catch(err){
            console.error(err);
        }
    
        sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`).then(row => {
            row = row.rows[0];
            if(!row) return;    
    
            if(row.enabled === "yes" && row.logreactions === "yes"){
               var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
               ch.send("```diff\n-Reaction Removed:\n" + `User: ${user.tag}\nEmoji: ${messageReaction.emoji.name}\nMessage: \n+${messageReaction.message.author.tag}: ${messageReaction.message.content}`  + "```")
            }
    
        });

}