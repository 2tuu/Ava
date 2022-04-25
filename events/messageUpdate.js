const Discord = require(`discord.js`);
exports.run = async (deletedMessage, sql, client, oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    if (!oldMessage.channel.guild) return; //bugfix for console error, might need to be undone

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



    if (!deletedMessage[oldMessage.channel.guild.id + "-" + channelID]) {
        deletedMessage[oldMessage.channel.guild.id + "-" + channelID] = {
            message: oldMessage,
            author: oldMessage.author.tag,
            avatar: oldMessage.author.avatarURL,
            newContent: oldMessage.newMessage,
            type: "Edited"
        };
    }

    deletedMessage[oldMessage.channel.guild.id + "-" + channelID].message = oldMessageVar + " ⇨ " + newMessageVar.content;
    deletedMessage[oldMessage.channel.guild.id + "-" + channelID].author = oldMessage.author.username + '#' + oldMessage.author.discriminator;
    deletedMessage[oldMessage.channel.guild.id + "-" + channelID].avatar = newMessage.author.avatarURL();

    //Dana's mod log
    if (oldMessage.content === newMessage.content) return;

    try {
        var guildID = oldMessage.channel.guild.id;
    } catch (err) {
        console.error(err);
    }

    sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`).then(row => {
        row = row.rows[0];
        if (!row) return;

        if (row.ignore.split(',').includes(channelID)) return;

        if (row.enabled === "yes" && row.logmessages === "yes" && oldMessage.author.bot === false) {
            var desc = "+Message Updated in " + oldMessage.channel.name + ':\n' + `${oldMessage.author.tag}: ${oldMessage.content} => ${newMessage.content}` + "\nMessage ID: " + oldMessage.id;

            var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.neutral}`)
                .setDescription("```diff\n" + desc + "\n```")
            return ch.send({ embeds: [embed] });
        }

    });

}