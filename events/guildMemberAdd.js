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
  
      sql.get(`SELECT * FROM modlog WHERE serverId ="${guildID}"`).then(row => {
  
          if(!row) return;
  
          if(row.enabled === "yes" && row.logLeaves === "yes"){
             var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
             ch.send("```diff\n+Member Joined: " + member.user.tag + "\nCurrent Count:" + member.guild.memberCount + "\n```")
          }
  
      });

    //Extra additions that may not exist in inactive guilds
    sql.get(`SELECT * FROM announce WHERE guild ="${member.guild.id}"`).then(row => {
      if(!row){
        sql.run("INSERT INTO announce (guild, channel) VALUES (?, ?)", [member.guild.id, null]);
        console.log("added to announcement");
      }
    });
  
    //Welcome message setting store, goes in the same table as the prefixes
    sql.get(`SELECT * FROM prefixes WHERE serverId ="${member.guild.id}"`).then(row => {
      if(!row){
        sql.run("INSERT INTO prefixes (prefix, welcomeMessage, welcomeChannel, shouldWelcome, serverId) VALUES (?, ?, ?, ?, ?)", ["k?", "This is a placeholder", "null", "false", member.guild.id]);
        console.log("added to prefixes");
      }
  
  
      const guild = member.guild;
    
      if(row.shouldWelcome === "false") return;
    
      if(row.welcomeChannel === "null"){
        return;
      } else if(row.shouldWelcome === "true"){
    
        async function welcome(){
    
          var mbr = await member;
          var gld = mbr.guild;
          var mbr = mbr.user;
    
          var WelcomeMessage = row.welcomeMessage.replace(new RegExp("{member}", 'g'), "<@" + mbr.id + ">");
          var WelcomeMessage = WelcomeMessage.replace(new RegExp("{member.username}", 'g'), mbr.username);
          var WelcomeMessage = WelcomeMessage.replace(new RegExp("{guild}", 'g'), gld.name);
    
          guild.channels.cache.get(row.welcomeChannel).send(WelcomeMessage).catch((error) => {
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