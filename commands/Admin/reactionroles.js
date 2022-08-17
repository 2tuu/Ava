const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql) => {
    if (!message.member.permissions.has('MANAGE_ROLES')) return message.reply("Sorry, you don't have permission to use this.");

    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .addField("Description", client.help['reactionroles'].help)
            .addField("Usage", '```' + client.help['reactionroles'].format + '```')
        return message.channel.send({ embeds: [embed] });
    }

    function findRole(arg) {
        //find role by id or name
        rname = message.guild.roles.cache.find(r => r.name.toLowerCase() === arg);
        rid = message.guild.roles.cache.find(r => r.id === arg);

        if (!rname && !rid) {
            return false;
        } else {
            if (rname) {
                return rname;
            } else {
                return rid;
            }
        }
    }


    switch (args[0].toLowerCase()) {
        case 'reset':
            sql.query(`UPDATE reactionroles SET roles = '{}' WHERE serverid = '${message.guild.id}'`);
            sql.query(`UPDATE reactionroles SET messageid = null WHERE serverid = '${message.guild.id}'`);
            var embed = new Discord.MessageEmbed()
                .setDescription('Role list reset')
                .setColor(`0x${client.colors.good}`)
            return message.channel.send({ embeds: [embed] });
        case 'add':
            //format k?reaction Role Name -e :emote:
            var roleArgs = args.slice(1).join(' ').split('-e');
            if (!roleArgs[1]) {
                var embed = new Discord.MessageEmbed()
                    .setDescription('Please give me an emote')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            } else if (roleArgs[0].length === 0) {
                var embed = new Discord.MessageEmbed()
                    .setDescription('Please give me a role')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            }

            //findrole
            var emote = roleArgs[1].match(/[^\s:]+|:([^:]*):/g);
            if (emote.length < 3) {
                var embed = new Discord.MessageEmbed()
                    .setDescription('Please give me an emote')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            }
            emote = emote[2].replace('>', '');

            if (!client.emojiPile.includes(emote.toString())) {
                //no emote
                var embed = new Discord.MessageEmbed()
                    .setDescription('Couldn\'t find that emote `"' + emote + '"`')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            } else if (!findRole(roleArgs[0].slice(0, -1))) {
                //no role
                var embed = new Discord.MessageEmbed()
                    .setDescription('Couldn\'t find that role`"' + roleArgs[0].slice(0, -1) + '"`')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            }


            //add role to db object
            var row = await sql.query(`select * from reactionroles where serverid = '${message.guild.id}'`)
            row = row.rows[0];
            row = JSON.parse(row.roles);

            var updating = false;
            if (row[emote]) updating = true;

            row[emote] = { role: findRole(roleArgs[0].slice(0, -1)).id }

            //update db
            sql.query(`UPDATE reactionroles SET roles = '${JSON.stringify(row)}' WHERE serverid = '${message.guild.id}'`);

            //confirmation message
            if (updating) {
                var embed = new Discord.MessageEmbed()
                    .setDescription('Updated role')
                    .setColor(`0x${client.colors.good}`)
                return message.channel.send({ embeds: [embed] });
            } else {
                var embed = new Discord.MessageEmbed()
                    .setDescription('Added role')
                    .setColor(`0x${client.colors.good}`)
                return message.channel.send({ embeds: [embed] });
            }

        case 'delete':
            //add argument 'missing', looks for roles in list that are missing from server
            if (!args[1]) {
                var embed = new Discord.MessageEmbed()
                    .setDescription('Missing Arguments')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            }

            var row = await sql.query(`select * from reactionroles where serverid = '${message.guild.id}'`)
            row = row.rows[0];

            var roles = JSON.parse(row.roles);

            if (args[1].toLowerCase() === 'missing') {
                var toRemove = {};

                Object.entries(roles).forEach(([key, value]) => {
                    var role = findRole(value.role);
                    if (role) {
                        toRemove[key] = { role: value.role }
                    }
                })

                var difference = Object.entries(roles).length - Object.entries(toRemove).length;

                if (difference === 0) {
                    var embed = new Discord.MessageEmbed()
                        .setDescription('I couldn\'t find any roles to remove')
                        .setColor(`0x${client.colors.bad}`)
                    return message.channel.send({ embeds: [embed] });
                } else {
                    sql.query(`UPDATE reactionroles SET roles = '${JSON.stringify(toRemove)}' WHERE serverid = '${message.guild.id}'`);

                    var embed = new Discord.MessageEmbed()
                        .setDescription(`Removed ${difference} role(s)`)
                        .setColor(`0x${client.colors.good}`)
                    return message.channel.send({ embeds: [embed] });
                }
            } else {
                var role = findRole(args.slice(1).join(' ').toLowerCase())
                if (!role) {
                    var embed = new Discord.MessageEmbed()
                        .setDescription('I can\'t find that role')
                        .setColor(`0x${client.colors.bad}`)
                    return message.channel.send({ embeds: [embed] });
                } else {
                    var toRemove = {};
                    Object.entries(roles).forEach(([key, value]) => {
                        if(value.role == role.id) return
                        toRemove[key] = { role: value.role }
                    })
                    sql.query(`UPDATE reactionroles SET roles = '${JSON.stringify(toRemove)}' WHERE serverid = '${message.guild.id}'`);
                    var embed = new Discord.MessageEmbed()
                        .setDescription(`Removed role`)
                        .setColor(`0x${client.colors.good}`)
                    return message.channel.send({ embeds: [embed] });
                }
            }
            break;

        case 'list':
            var row = await sql.query(`select * from reactionroles where serverid = '${message.guild.id}'`)
            row = row.rows[0];

            var roles = JSON.parse(row.roles);

            if (Object.entries(roles).length === 0) {
                var embed = new Discord.MessageEmbed()
                    .setDescription('I can\'t find a list')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            }

            var list = '';

            Object.entries(roles).forEach(([key, value]) => {
                list = list + '<:emote:' + key + '> - <@&' + value.role + '>\n'
            })

            var embed = new Discord.MessageEmbed()
                .setTitle('Roles')
                .setDescription(list)
            return message.channel.send({ embeds: [embed] });
        case 'setmessage':
            if (!args[1]) {
                var embed = new Discord.MessageEmbed()
                    .setDescription("You didn't give me a channel")
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            } else {
                var chan = args[1].replace('<#', '')
                chan = chan.replace('>', '')

                message.guild.channels.fetch(chan).then(chanVar => {
                    //check if channel exists
                    if (args[2]) {
                        //look for message
                        chanVar.messages.fetch(args[2])
                            .then(fMessage => {
                                //update messageid in database
                                var db = {
                                    channelid: fMessage.channel.id,
                                    messageid: fMessage.id
                                }
                                db = JSON.stringify(db);
                                sql.query(`UPDATE reactionroles SET messageid = '${db}' WHERE serverid = '${message.guild.id}'`);

                                var embed = new Discord.MessageEmbed()
                                    .setDescription("Channel updated")
                                    .setColor(`0x${client.colors.good}`)
                                return message.channel.send({ embeds: [embed] });
                            })
                            .catch(err => {
                                var embed = new Discord.MessageEmbed()
                                    .setDescription("I can't see any messages")
                                    .setColor(`0x${client.colors.bad}`)
                                message.channel.send('ERR: `' + err.stack + '`')
                                return message.channel.send({ embeds: [embed] });
                            })
                    } else {
                        //last message ID here
                        chanVar.messages.fetch({ limit: 1 })
                            .then(fMessage => {
                                fMessage = fMessage.first();
                                //update messageid in database
                                var db = {
                                    channelid: fMessage.channel.id,
                                    messageid: fMessage.id
                                }
                                db = JSON.stringify(db);
                                sql.query(`UPDATE reactionroles SET messageid = '${db}' WHERE serverid = '${message.guild.id}'`);

                                var embed = new Discord.MessageEmbed()
                                    .setDescription("Channel updated")
                                    .setColor(`0x${client.colors.good}`)
                                return message.channel.send({ embeds: [embed] });
                            })
                            .catch(err => {
                                var embed = new Discord.MessageEmbed()
                                    .setDescription("I can't see any messages")
                                    .setColor(`0x${client.colors.bad}`)
                                message.channel.send('ERR: `' + err.stack + '`')
                                return message.channel.send({ embeds: [embed] });
                            })
                    }
                }).catch(err => {
                    var embed = new Discord.MessageEmbed()
                        .setDescription("I can't find that channel")
                        .setColor(`0x${client.colors.bad}`)

                    message.channel.send('ERR: `' + err.stack + '`')
                    return message.channel.send({ embeds: [embed] });
                })

            }
            //find message by ID (this is a message a staff member has already sent)
            //maybe option to find most recent message in a channel
            //clear all reactions on selected message

            //add reactions from db object
            //error if can't find emote

            //change message id in db object
            break;

        default:
            var embed = new Discord.MessageEmbed()
                .addField("Description", client.help['reactionroles'].help)
                .addField("Usage", '```' + client.help['reactionroles'].format + '```')
            return message.channel.send({ embeds: [embed] });
    }
}

/*
help notes:
 - description:

 - format:  k?reactionroles add rolename -e :emote:
            k?reactionroles delete rolename
            k?reactionroles delete missing
            k?reactionroles reset
            k?reactionroles list
            k?reactionroles setmessage #channel <- will add reactions to the most recent message in the channel
            k?reactionroles setmessage #channel <messageid> <- adds reactions to specific message
 - notes:
    - need to add a cooldown to the reaction, automatically remove reaction from the reactionrole message if it
      was added to the message less than 3 seconds after the most recent one, instead of adding a role
*/

exports.conf = {
    name: "Reaction Roles [BETA]",
    help: "Add role reactions to a message in your rules channel",
    format: "[IN PROGRESS]",
    DM: false,
    ownerOnly: true,
    alias: ['react'],
    slashCommand: false
}