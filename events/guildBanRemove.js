const Discord = require(`discord.js`);

exports.run = async (deletedMessage, sql, client, guild, user) => {

    try {
        var guildID = guild.id;
    } catch (err) {
        console.error(err);
    }

    sql.query(`SELECT * FROM modlog WHERE serverid ='${guildID}'`).then(row => {
        row = row.rows[0];
        if (!row) return;

        if (row.enabled === "yes" && row.logbans === "yes") {
            var ch = client.guilds.cache.get(guildID).channels.cache.get(row.channel);
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.good}`)
                .setDescription("```diff\n" +
                    `+Member Unbanned: ${user.tag}` +
                    "\n```")
            return ch.send({ embeds: [embed] });
        }

    });

}