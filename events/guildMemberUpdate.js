const Discord = require(`discord.js`);

exports.run = (deletedMessage, sql, client, oldMember, newMember) => {

    try{

        if(oldMember.nickname === newMember.nickname) return;

        var guildID = oldMember.guild.id;
        } catch(err){
            console.error(err);
        }
    
        var row = (`SELECT * FROM modlog WHERE serverId ="${guildID}"`);
    
            if(!row) return;
    
            if(row.enabled === "yes" && row.logMembers === "yes"){
               var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
               ch.send("```diff\n+" + oldMember.user.tag + 
               " changed their nickname:\n" + oldMember.nickname + " => " + newMember.nickname + "\n```")
            }
    

}