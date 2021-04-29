exports.run = async (deletedMessage, sql, client, oldMessage, newMessage) => {
    if(oldMessage.author.bot) return;

    var channelID = oldMessage.channel.id;
  
    var oldMessageVar = await oldMessage.content;
    var newMessageVar = await newMessage;
  
    //Invite redactor
    var messageContent = newMessage.content.trim().replace(
        new RegExp(/(?:discord(?:(?:.|.?dot.?)(?:gg|me|li|to)|app(?:.|.?dot.?)com\/invite)|(invite|disco)(?:.|.?dot.?)gg)\/[\da-z]+/igm), "[INVITE]"
        )
    oldMessageVar = oldMessageVar.trim().replace(
        new RegExp(/(?:discord(?:(?:.|.?dot.?)(?:gg|me|li|to)|app(?:.|.?dot.?)com\/invite)|(invite|disco)(?:.|.?dot.?)gg)\/[\da-z]+/igm), "[INVITE]"
        )
  
  
    if(!deletedMessage[oldMessage.guild.id + "-" + channelID]){
        deletedMessage[oldMessage.guild.id + "-" + channelID] = {
            message: oldMessage,
            author: oldMessage.author.tag,
            avatar: oldMessage.author.avatarURL,
            newContent: oldMessage.newMessage,
            type: "Edited"
        };
    }
        
    deletedMessage[oldMessage.guild.id + "-" + channelID].message = oldMessageVar + " ⇨ " + newMessageVar;
    deletedMessage[oldMessage.guild.id + "-" + channelID].author = oldMessage.author.username;
    deletedMessage[oldMessage.guild.id + "-" + channelID].avatar = oldMessage.author.avatarURL;

    //Dana's mod log
    if(oldMessage.content === newMessage.content) return;

    try{
        var guildID = oldMessage.guild.id;
        } catch(err){
            console.error(err);
        }
    
        var row = sql.get(`SELECT * FROM modlog WHERE serverId ="${guildID}"`);
            if(!row) return;
    
            if(row.enabled === "yes" && row.logMessages === "yes" && oldMessage.author.bot === false){
               var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
               ch.send("```diff\n+Message Updated in " + oldMessage.channel.name + ':\n' + `${oldMessage.author.tag}: ${oldMessage.content} => ${newMessage.content}` + "\nMessage ID: " + oldMessage.id + "\n```")
            }
        
  }