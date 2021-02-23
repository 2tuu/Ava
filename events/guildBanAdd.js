const Discord = require(`discord.js`);

exports.run = async (deletedMessage, sql, client, guild, user) => {

    try{
    var guildID = guild.id;
    var reason = "No Reason";

    } catch(err){
        console.error(err);
    }

    var row = await sql.get(`SELECT * FROM modlog WHERE serverId ="${guildID}"`);

        var audit = await guild.fetchAuditLogs();



        try{
        var auditLog = await audit.entries.first();
        }
        catch(err){
            var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
            return ch.send("```diff\n-An error occured when accessing the audit log, please make sure I have permission to view it" + "\n```")
        }


        if(auditLog.reason){
        reason = auditLog.reason;
        }
        
        if(!row) return;

        if(row.enabled === "yes" && row.logBans === "yes"){
            var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
            ch.send("```diff\n-Member Banned: " + user.tag + `\nReason: ${reason}` + "\n```")
        }

}