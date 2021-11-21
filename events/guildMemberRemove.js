const Discord = require(`discord.js`);

exports.run = async (deletedMessage, sql, client, member) => {
 
var row = await sql.query(`SELECT * FROM modlog WHERE serverid ='${member.guild.id}'`);
row = row.rows[0];
if(!row) return;
    
  var audit = await member.guild.fetchAuditLogs(20);
  var auditLog = await audit.entries.first();

  var currentTime = Date.now();
  try{
  var auditTime = audit.entries.first().createdTimestamp;
  } catch(err){} //ignore 2fa error


  var wasKick = false;
  var wasRecent = false;

  var diffe = currentTime - auditTime;

      if(diffe > 1000){
        wasKick = false;
      } else {
        waskick = true;
        wasRecent = true;
      }

      if(audit.entries.first().target.id === member.id && wasRecent === true){
        wasKick = true;
      } else {
        wasKick = false;
      }
  
  
      try{
        var guildID = member.guild.id;
        } catch(err){
            console.error(err);
        }
    
    
            if(row.enabled === "yes" && row.logleaves === "yes"){

              if(wasKick){
                var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
                const embed = new Discord.MessageEmbed()
                .setColor(0xFF4D00)
                .setDescription("```diff\n-Member Kicked/Banned\nExecutor: " + auditLog.executor.tag + "\nReason: '" + auditLog.reason + "'\nMember: " + member.user.tag + "\n```")
                return ch.send({embed});
               }

              var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
              const embed = new Discord.MessageEmbed()
              .setColor(0xFF4D00)
              .setDescription("```diff\n-Member Left: " + member.user.tag + "\nCurrent Count:" + member.guild.memberCount + "\n```")
              return ch.send({embed});
               

            }
   
}
