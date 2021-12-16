const Discord = require(`discord.js`);

exports.run = async (deletedMessage, sql, client, guild, user) => {
  if(!row) return;

  if(row.enabled === "yes" && row.logbans === "yes"){
    try{
      var guildID = guild.id;
      var reason = "No Reason";
    } catch(err){
      console.error(err);
    }

    var row = await sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`);

    var audit = await guild.fetchAuditLogs(22);
    try{
      var auditLog = await audit.entries.first();
    }
    catch(err){
      var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
      return ch.send("```diff\n-An error occured when accessing the audit log, please make sure I have permission to view it" + "\n```")
    }

    var currentTime = Date.now();
    var auditTime = audit.entries.first().createdTimestamp;

    var wasKick = false;
    var wasRecent = false;

    var diffe = currentTime - auditTime;

    if(diffe > 1000){
      wasKick = false;
    } else {
      waskick = true;
      wasRecent = true;
    }

    if(audit.entries.first().target.id === user.id && wasRecent === true){
      wasKick = true;
    } else {
      wasKick = false;
    }

    if(auditLog.reason){
      reason = auditLog.reason;
    }

    var executor = auditLog.executor.tag;

    var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
    const embed = new Discord.MessageEmbed()
      .setColor(`0x${client.colors.bad}`)
      .setDescription("```diff\n-Member Banned: " + user.tag + `\nReason: ${reason}` + "\nExecutor: " + executor + "```")
    return ch.send({embed});
  }
}