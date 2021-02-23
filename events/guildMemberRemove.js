const Discord = require(`discord.js`);

exports.run = async (deletedMessage, sql, client, member) => {
 
var row = await sql.get(`SELECT * FROM modlog WHERE serverId ="${member.guild.id}"`);
if(!row) return;
    
  var audit = await member.guild.fetchAuditLogs();
  var auditLog = await audit.entries.first();

  var currentTime = Date.now();
  var auditTime = Date.parse(audit.entries.first().createdAt);

  var wasKick = false;

  if(auditLog.action === "MEMBER_KICK"){
      if(currentTime-1500 < auditTime && auditTime < currentTime+1500){
        wasKick = true;
      }
  }

    try{
        var guildID = member.guild.id;
        } catch(err){
            console.error(err);
        }
    
        if(wasKick && row.logKicks === 'yes'){
            var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
            ch.send("```diff\n-Member Kicked\nReason: '" + auditLog.reason + "'\nMember: " + member.user.tag + "\nCurrent Count:" + member.guild.memberCount + "\n```")
           }
    
            if(row.enabled === "yes" && row.logLeaves === "yes"){

              var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
              ch.send("```diff\n-Member Left: " + member.user.tag + "\nCurrent Count:" + member.guild.memberCount + "\n```")
               

            }
   
}
