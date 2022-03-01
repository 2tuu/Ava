const Discord = require(`discord.js`);
exports.run = (deletedMessage, sql, client, role) => {

    try{
        var guildID = role.guild.id;
        } catch(err){
            console.error(err);
        }
    
        sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`).then(row => {
            row = row.rows[0];
            if(!row) return;
    
            if(row.enabled === "yes" && row.logroles === "yes"){
               var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
               const embed = new Discord.MessageEmbed()
               .setColor(`0x${client.colors.bad}`)
               .setDescription("```diff\n-Role Deleted:\n" + `Color: ${role.color} | Name: ${role.name}`  + "```")
               return ch.send({ embeds: [embed] });
            }
    
        });
   
}