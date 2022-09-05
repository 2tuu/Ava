exports.run = (deletedMessage, sql, client, reaction, user) => {
    if(reaction.message.guild.id !== '911771065884233728') return;
    try {
        sql.query(`SELECT * FROM reactionroles WHERE serverid ='${reactionmessage.guild.id}'`).then(row => {

            row = row.rows[0];

            //{"channelid":"964202549651578950","messageid":"964202612071227413"}
            var channelVar = JSON.parse(row.channelid);
            console.log('channelVar:\n' + channelVar)

            //message and channel id alligns with DB
            if (reaction.message.id == channelVar.messageid && reaction.message.channel.id == channelVar.channelid) {
                var roles = JSON.parse(row.roles);
                var eIDs = [];

                Object.entries(roles).forEach(([key, value]) => {
                    eIDs.push(key);
                })
                console.log('EIDs:\n' + eIDs.join(','))

                //emote is valid
                if(eIDs.includes(reaction.emoji.id.toString())){
                    var role = roles[reaction.emoji.id.toString()].role;
                    reaction.message.guild.members.fetch(user.id).then(member=>{
                        //console.log('role add')
                        member.roles.add(role);
                    })
                }
            } else {
                // ignore
            }
        });
    } catch (err) { } //ignore improper congfigs
}