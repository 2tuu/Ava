const Discord = require(`discord.js`);

exports.run = async (deletedMessage, sql, client, guild, user) => {

    try{
    var guildID = guild.id;
    } catch(err){
        console.error(err);
    }

    var row = sql.get(`SELECT * FROM modlog WHERE serverId ="${guildID}"`);

        if(!row) return;

        if(row.enabled === "yes" && row.logBans === "yes"){
           var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
           ch.send("```diff\n+Member Unbanned: " + user.tag + "\n```")
        }
   
}