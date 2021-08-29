const Discord = require(`discord.js`);

exports.run = async (deletedMessage, sql, client, newChannel, oldChannel) => {
    var channel = newChannel;
    try{
    var guildID = channel.guild.id;
    } catch(err){
        console.error(err);
    }

    sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`).then(row => {
        row = row.rows[0];
        if(!row) return;
        if(newChannel.nsfw === oldChannel.nsfw && newChannel.topic === oldChannel.topic && oldChannel.name === newChannel.name) return;

        if(row.enabled === "yes" && row.logchannels === "yes"){

            if(newChannel.name === oldChannel.name && newChannel.topic === oldChannel.topic && newChannel.parent.name === oldChannel.parent.name){
                return;
            } else {
           var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
            ch.send("```diff\n+Channel Updated``````diff\n" + 
            "-Old Channel:\nName: " + newChannel.name +
            "\nTopic: " + newChannel.topic + 
            "\nNSFW: " + newChannel.nsfw + 
            "\n Category: " + newChannel.parent.name + "\n``````diff\n" + 
            "+New Channel:\nName: " + oldChannel.name +
            "\nTopic: " + oldChannel.topic + 
            "\nNSFW: " + oldChannel.nsfw + 
            "\nCategory: " + oldChannel.parent.name + "\n```\n")
           }
        }
    });
}