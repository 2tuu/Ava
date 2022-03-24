const Discord = require(`discord.js`);

exports.run = (deletedMessage, sql, client, oldMember, newMember) => {
    try {
        if (oldMember.nickname === newMember.nickname) return;
        var guildID = oldMember.guild.id;
    } catch (err) {
        console.error(err);
    }

    sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`).then(row => {
        row = row.rows[0];
        if (!row) return;

        if (row.enabled === "yes" && row.logmembers === "yes") {
            var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.neutral}`)
                .setDescription("```diff\n+" + oldMember.user.tag +
                    " changed their nickname:\n" + oldMember.nickname + " => " + newMember.nickname + "\n```")
            return ch.send({ embeds: [embed] });
        }
    });
}