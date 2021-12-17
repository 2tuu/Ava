const Discord = require(`discord.js`);
exports.run = async (deletedMessage, sql, client, message) => {

    //Deleted message logger, for mod log and snipe command (quick-delete catcher)

    //Invite redactor
    var messageContent = (message.content.trim().replace(new RegExp(/(?:discord(?:(?:.|.?dot.?)(?:gg|me|li|to)|app(?:.|.?dot.?)com\/invite)|(invite|disco)(?:.|.?dot.?)gg)\/[\da-z]+/igm), "[INVITE]"));
  
    var channelID = message.channel.id;

    if(!message.guild) return; //ignore dms
  
    if(!deletedMessage[message.guild.id + "-" + channelID]){
      deletedMessage[message.guild.id + "-" + channelID] = {
        message: messageContent,
        author: message.author.tag,
        avatar: message.author.avatarURL,
        type: "Deleted"
      };
    }

    deletedMessage[message.guild.id + "-" + channelID].message = messageContent;
    deletedMessage[message.guild.id + "-" + channelID].author = message.author.username;
    deletedMessage[message.guild.id + "-" + channelID].avatar = message.author.avatarURL;

    //Dana's mod log
    var Attachment = [];

    try{
        var guildID = message.guild.id;
        } catch(err){
            console.error(err);
        }
    
        var row = await sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`);
            row = row.rows[0];

           

            if(message.attachments){
            Attachment = message.attachments.array().map(m => m.url);
            Attachment = Attachment.join(', ');
            }
    
            if(!row) return;
            if(row.ignore.split(',').includes(message.channel.id)) return;
    
            if(row.enabled === "yes" && row.logmessages === "yes" && message.author.bot === false){
               var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);

               if(Attachment[0]){
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription("```diff\n-Message Deleted in " + message.channel.name + ':\n' + `${message.author.tag}: ${message.content}` + "\nMessage ID: " + message.id + "\n```\n"+
                            "```diff\n+Attachments:\n" + Attachment + "\n```")
                return ch.send({embed});

               } else {
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription("```diff\n-Message Deleted in " + message.channel.name + ':\n' + `${message.author.tag}: ${message.content}` + "\nMessage ID: " + message.id + "\n```")
                return ch.send({embed});
               }
            }

}