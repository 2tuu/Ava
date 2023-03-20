const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql, tossedSet, roles) => {

    if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['mute'].help)
			.addField("Usage", '```' + client.help['mute'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

    try {
        sql.query(`SELECT * FROM settings WHERE serverId ='${message.member.guild.id}'`).then(row => {
            row = row.rows[0];

            async function profileA() {
                if (!row) {
                    await sql.query(`INSERT INTO settings (serverId, banId) VALUES (${message.member.guild.id}, 'null')`);
                }
            }

            profileA();

        }).catch((err) => {
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setTitle('Error: ' + err)
            client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        });

        if (!message.member.permissions.has('MANAGE_ROLES')) return message.reply("Sorry, you don't have permission to use this.");

        if (args[0] === "roleadd") {

            sql.query(`SELECT * FROM settings WHERE serverId ='${message.member.guild.id}'`).then(row => {

                if (!row) {
                    sql.query(`INSERT INTO settings (serverId, banId) VALUES (${message.member.guild.id}, 'null')`);
                }

                var roleList = message.member.guild.roles.cache;
                roleList = roleList.map(r => ({ name: r.name, id: r.id }));

                var tossedRole = roleList.filter(r => r.name.toLowerCase() === args[1].toLowerCase());
                tossedRole = tossedRole[0];

                if (!tossedRole) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setTitle("A role with this name was not found")
                    return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                } else {

                    sql.query(`UPDATE settings SET banId = '${tossedRole.id}' WHERE serverId = '${message.member.guild.id}'`).then(() => {
                        const embed = new Discord.MessageEmbed()
                            .setColor(`0x${client.colors.good}`)
                            .setDescription("Role added")
                        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                    }).catch((err) => {

                        const embed = new Discord.MessageEmbed()
                            .setColor(`0x${client.colors.bad}`)
                            .setTitle("An error occured")
                            .setFooter(err)
                        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                    });

                }
            }).catch((err) => {
                console.error(err.stack);
            });
        } else {
            var argVar = args[0].replace("<@", "").replace("!", "").replace(">", "");
            var member = message.member.guild.members.cache.get(argVar);

            if (!member) {
                //invalid ID
            } else {
                var db = await sql.query(`SELECT * FROM settings WHERE serverId ='${message.member.guild.id}'`);
                db = db.rows[0];

                if (!db.banid || !db || !message.member.guild.roles.cache.get(db.banid)) {
                    const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setTitle('A mute role isn\'t set, or the one you set isn\'t valid')
                client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                } else {
                    //add role or remove role
                    try {

                        if (member.roles.cache.map(r => r.id).includes(db.banid)) { //already has role, remove
                            //Removed role
                            const embed = new Discord.MessageEmbed()
                                .setColor(`0x${client.colors.good}`)
                                .setDescription(member.user.tag + " has been unmuted")
                            client.messageHandler(message, client.isInteraction, { embeds: [embed] });

                            member.roles.remove(db.banid);
                        } else {
                            var worked = true;

                            member.roles.add(db.banid).catch(err => {
                                worked = false;
                                const embed = new Discord.MessageEmbed()
                                    .setColor(`0x${client.colors.bad}`)
                                    .setDescription("An error has occured, make sure I have permission to edit roles, and your mute role is below my own role")
                                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                            }).then(()=>{
                                if(worked){
                                    const embed = new Discord.MessageEmbed()
                                        .setColor(`0x${client.colors.bad}`)
                                        .setDescription(member.user.tag + " has been muted")
                                    client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                                }
                            });
                            
                        }


                        if (args.join(' ').match(/-t (.*)/g)) {

                            function getSeconds(str) {
                                var seconds = 0;
                                var days = str.match(/(\d+)\s*d/);
                                var hours = str.match(/(\d+)\s*h/);
                                var minutes = str.match(/(\d+)\s*m/);
                                if (days) { seconds += parseInt(days[1]) * 86400; }
                                if (hours) { seconds += parseInt(hours[1]) * 3600; }
                                if (minutes) { seconds += parseInt(minutes[1]) * 60; }
                                return seconds * 1000;
                            }

                            var num = args.join(' ').match(/-t (.*)/g)[0].replace('-t ', '');
                            num = getSeconds(num.toString());
                            if (isNaN(num) || num < 1) {
                                const embed = new Discord.MessageEmbed()
                                .setColor(`0x${client.colors.bad}`)
                                .setTitle('The time given was invalid, use `-t #h #m`\nThe member was muted normally')
                            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                            } else {
                                //help me
                                setTimeout(() => {
                                    member.roles.remove(db.banid).catch((err) => { console.error(err.stack) });
                                }, num);
                            }
                        }

                    } catch (err) {
                        //error giving or taking role
                        const embed = new Discord.MessageEmbed()
                                .setColor(`0x${client.colors.bad}`)
                                .setTitle('There was an error muting this member, do I have permission?\n```js\n' + err + '\n```')
                        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                    }
                }
            }

        }


    } catch (err) {
        const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.bad}`)
            .setTitle(`An error occured, please report this to the developers: \`\`\`js\n${err.stack}\`\`\``)
        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

}

exports.conf = {
    name: "Mute",
    help: "Mute the mentioned user",
    format: "k?mute [@user]\nk?mute roleadd [role-name]",
    DM: false,
    ownerOnly: false,
    alias: ['unmute'],
    slashCommand: true,
    data: {
        name: "mute",
        description: "Mute a user",
        options: [
            {
                choices: undefined,
                autocomplete: undefined,
                type: 3,
                name: 'user',
                description: '@ the user you want to mute',
                required: true
            }
        ],
        dm_permission: false
    }
}
