exports.run = (deletedMessage, sql, client, role) => {

    try{
        var guildID = role.guild.id;
        console.log(guildID);
        } catch(err){
            console.error(err);
        }
    
        sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`).then(row => {
            row = row.rows[0];
            if(!row) return;
    
            if(row.enabled === "yes" && row.logroles === "yes"){
               var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
               ch.send("```diff\n-Role Deleted:\n" + `Color: ${role.color} | Name: ${role.name}`  + "```");
            }
    
        });
   
}