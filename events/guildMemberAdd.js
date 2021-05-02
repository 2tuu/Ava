exports.run = (deletedMessage, sql, client, member) => {

    //Ignore these action for newly invited bots
    if(member.bot) return;
  
    //Dana's member join logger, only works if it's enabled by the end user
    try{
      var guildID = member.guild.id;
      //console.log(guildID);
      } catch(err){
          console.error(err);
      }
  
      sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`).then(row => {
        row = row.rows[0];
        if(!row) return;
  
          if(row.enabled === "yes" && row.logLeaves === "yes"){
             var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
             ch.send("```diff\n+Member Joined: " + member.user.tag + "\nCurrent Count:" + member.guild.memberCount + "\n```")
          }
  
      });

    //Extra additions that may not exist in inactive guilds
    sql.query(`SELECT * FROM announce WHERE guild ='${member.guild.id}'`).then(row => {
      row = row.rows[0];
      if(!row){
        sql.query(`INSERT INTO announce (guild, channel) VALUES (${member.guild.id}, null)`);
        console.log("added to announcement");
      }
    });
  
    //Welcome message setting store, goes in the same table as the prefixes
    sql.query(`SELECT * FROM prefixes WHERE serverId ='${member.guild.id}'`).then(row => {
  
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
          var WelcomeMessage = Welcomemessage.replace(new RegExp("{member.username}", 'g'), mbr.username);
          var WelcomeMessage = Welcomemessage.replace(new RegExp("{guild}", 'g'), gld.name);
    
          guild.channels.cache.get(row.welcomechannel).send(WelcomeMessage).catch((error) => {
            console.error(error);
            return;
          });
        }
    
        welcome();

    }
  
    }).catch(() => {
      console.error;
    });
  
      
    
	
  }