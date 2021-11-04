exports.run = (deletedMessage, sql, client, member) => {

    if(member.bot) return;
  
    try{
      var guildID = member.guild.id;

      } catch(err){
          console.error(err);
      }
  
      sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`).then(row => {
        row = row.rows[0];
        if(!row) return;
  
          if(row.enabled === "yes" && row.logleaves === "yes"){
             var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
             ch.send("```diff\n+Member Joined: " + member.user.tag + "\nCurrent Count:" + member.guild.memberCount + "\n```")
          }
  
      });

    sql.query(`SELECT * FROM announce WHERE guild ='${member.guild.id}'`).then(row => {
      row = row.rows[0];
      if(!row){
        sql.query(`INSERT INTO announce (guild, channel) VALUES (${member.guild.id}, null)`);
      }
    });
  
    sql.query(`SELECT * FROM prefixes WHERE serverid ='${member.guild.id}'`).then(row => {
      row = row.rows[0];
      if(!row.welcomemessage) return;
  
      const guild = member.guild;
    
      if(row.shouldwelcome === "false") return;
    
      if(row.welcomechannel === "null"){
        return;
      } else if(row.shouldwelcome === "true"){
    
        async function welcome(){
    
          var mbr = await member;
          var gld = mbr.guild;
          var mbr = mbr.user;
    
          var WelcomeMessage = row.welcomemessage.replace(new RegExp("{member}", 'g'), "<@" + mbr.id + ">");
          var WelcomeMessage = WelcomeMessage.replace(new RegExp("{member.username}", 'g'), mbr.username);
          var WelcomeMessage = WelcomeMessage.replace(new RegExp("{guild}", 'g'), gld.name);
    
          var ch = client.guilds.cache.get(guildID).channels.cache.get(row.welcomechannel);
          ch.send(WelcomeMessage).catch((error) => {
            console.error(error);
          });
        }
    
        welcome();

    }
  
    }).catch((err) => {
      console.error(err);
    });
  
      
    
	
  }