exports.run = (deletedMessage, sql, client, role) => {

    try{
        var guildID = role.guild.id;
        console.log(guildID);
        } catch(err){
            console.error(err);
        }
    
        var row = sql.get(`SELECT * FROM modlog WHERE serverId ="${guildID}"`);
    
            if(!row) return console.log('no row');
    
            if(row.enabled === "yes" && row.logRoles === "yes"){
               var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
               ch.send("```diff\n-Role Deleted:\n" + `Color: ${role.color} | Name: ${role.name}`  + "```");
            }
   
}