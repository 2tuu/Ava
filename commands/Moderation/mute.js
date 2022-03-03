const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql, tossedSet, roles) => {

    if (!args[0]) return client.messageHandler(message, client.isInteraction, 'Please enter a user ID or mention');

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
            client.messageHandler(message, client.isInteraction, 'Error: ' + err)
        });

        if (!message.member.permissions.has('MANAGE_ROLES')) {
            const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setTitle("Sorry, you don't have permission to use this. (MANAGE_ROLES Required)")
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        } else {

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
                        client.messageHandler(message, client.isInteraction, 'A muted role is not set, or the one you did set is invalid');
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
                                //Added role
                                const embed = new Discord.MessageEmbed()
                                    .setColor(`0x${client.colors.bad}`)
                                    .setDescription(member.user.tag + " has been muted")
                                client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                                member.roles.add(db.banid);
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
                                    return client.messageHandler(message, client.isInteraction, 'The time given was invalid, use `-t #h #m`\nThe member was muted normally');
                                } else {
                                    //help me
                                    setTimeout(() => {
                                        member.roles.remove(db.banid).catch((err) => { console.error(err.stack) });
                                    }, num);
                                }
                            }

                        } catch (err) {
                            //error giving or taking role
                            client.messageHandler(message, client.isInteraction, 'There was an error muting this member, do I have permission?\n```js\n' + err + '\n```')
                        }
                    }
                }

            }

        }

    } catch (err) {
        client.messageHandler(message, client.isInteraction, `An error occured, please report this to the developers: \`\`\`js\n${err.stack}\`\`\``)
    }

}

exports.conf = {
    name: "Mute",
    help: "Mute the mentioned user",
    format: "k?mute [@user]\nk?mute roleadd [role-name]",
    DM: false,
    ownerOnly: false,
    alias: [],
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
        default_permission: undefined
    }
}
