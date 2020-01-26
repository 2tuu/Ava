const Discord = require('discord.js');

    exports.run = (client, message, args, deletedMessage, sql) => {
        if(message.member.permissions.has('KICK_MEMBERS') || message.author.id === '378769654942007299') {

            if(args[1]){ args[1] = args[1].toLowerCase(); }

            if(args[0] === "toggle"){
                if(!args[1]){
                    sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
                        if(!row){
                            const embed = new Discord.RichEmbed()
                                    .setDescription("Modlog module Enabled")
                                    message.channel.send({embed});
                             sql.run("INSERT INTO modlog (logKicks, logReactions, logChannels, logEmojis, logBans, logLeaves, logMembers, logMessages, logRoles, serverId, enabled, channel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", ['no', 'no','no','no','no','no','no','no','no',message.guild.id,'yes',null ]);
                        } else {
                            if(row.enabled === "yes"){
                                console.log(row.enabled);
                                    const embed = new Discord.RichEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Modlog module Disabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET enabled = "no" WHERE serverId = "${message.guild.id}"`);
                            } else {
                                console.log(row.enabled);
                                    const embed = new Discord.RichEmbed()
                                        .setDescription("Modlog module Enabled")
                                        message.channel.send({embed});
                                sql.run(`UPDATE modlog SET enabled = "yes" WHERE serverId = "${message.guild.id}"`);
                            }
                        }
                    });


                } else if(args[1] === "logroles"){

                    sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
                        if(!row){
                            //enable first
                        } else {
                            if(row.logRoles === "yes"){
                                const embed = new Discord.RichEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Role Logging Disabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logRoles = "no" WHERE serverId = "${message.guild.id}"`);
                            } else {
                                const embed = new Discord.RichEmbed()
			                            .setDescription("Role Logging Enabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logRoles = "yes" WHERE serverId = "${message.guild.id}"`);
                            }
                        }
                    });

                } else if(args[1] === "logreactions"){

                    sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
                        if(!row){
                            //enable first
                        } else {
                            if(row.logReactions === "yes"){
                                const embed = new Discord.RichEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Reaction Logging Disabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logReactions = "no" WHERE serverId = "${message.guild.id}"`);
                            } else {
                                const embed = new Discord.RichEmbed()
			                            .setDescription("Reaction Logging Enabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logReactions = "yes" WHERE serverId = "${message.guild.id}"`);
                            }
                        }
                    });


                } else if(args[1] === "logmessages"){

                    sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
                        if(!row){
                            //enable first
                        } else {
                            if(row.logMessages === "yes"){
                                const embed = new Discord.RichEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Message Logging Disabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logMessages = "no" WHERE serverId = "${message.guild.id}"`);
                            } else {
                                const embed = new Discord.RichEmbed()
			                            .setDescription("Message Logging Enabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logMessages = "yes" WHERE serverId = "${message.guild.id}"`);
                            }
                        }
                    });

                } else if(args[1] === "logmembers"){

                    sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
                        if(!row){
                            //enable first
                        } else {
                            if(row.logMembers === "yes"){
                                const embed = new Discord.RichEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Member Logging Disabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logMembers = "no" WHERE serverId = "${message.guild.id}"`);
                            } else {
                                const embed = new Discord.RichEmbed()
			                            .setDescription("Member Logging Enabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logMembers = "yes" WHERE serverId = "${message.guild.id}"`);
                            }
                        }
                    });

                } else if(args[1] === "logbans"){

                    sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
                        if(!row){
                            //enable first
                        } else {
                            if(row.logBans === "yes"){
                                const embed = new Discord.RichEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Ban Logging Disabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logBans = "no" WHERE serverId = "${message.guild.id}"`);
                            } else {
                                const embed = new Discord.RichEmbed()
			                            .setDescription("Ban Logging Enabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logBans = "yes" WHERE serverId = "${message.guild.id}"`);
                            }
                        }
                    });


                } else if(args[1] === "logleaves"){

                    sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
                        if(!row){
                            //enable first
                        } else {
                            if(row.logLeaves === "yes"){
                                const embed = new Discord.RichEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Leave Logging Disabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logLeaves = "no" WHERE serverId = "${message.guild.id}"`);
                            } else {
                                const embed = new Discord.RichEmbed()
			                            .setDescription("Leave Logging Enabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logLeaves = "yes" WHERE serverId = "${message.guild.id}"`);
                            }
                        }
                    });

                } else if(args[1] === "logchannels"){

                    sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
                        if(!row){
                            //enable first
                        } else {
                            if(row.logChannels === "yes"){
                                const embed = new Discord.RichEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Channel Logging Disabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logChannels = "no" WHERE serverId = "${message.guild.id}"`);
                            } else {
                                const embed = new Discord.RichEmbed()
			                            .setDescription("Channel Logging Enabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logChannels = "yes" WHERE serverId = "${message.guild.id}"`);
                            }
                        }
                    });

                } else if(args[1] === "logemojis"){

                    sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
                        if(!row){
                            //enable first
                        } else {
                            if(row.logEmojis === "yes"){
                                const embed = new Discord.RichEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Emoji Logging Disabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logEmojis = "no" WHERE serverId = "${message.guild.id}"`);
                            } else {
                                const embed = new Discord.RichEmbed()
			                            .setDescription("Emoji Logging Enabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logEmojis = "yes" WHERE serverId = "${message.guild.id}"`);
                            }
                        }
                    });

                } else if(args[1] === "logkicks"){

                    sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
                        if(!row){
                            const embed = new Discord.RichEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Use k?modlog toggle to enable module")
			                            message.channel.send({embed});
                        } else {
                            if(row.logKicks === "yes"){
                                const embed = new Discord.RichEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Kick Logging Disabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logKicks = "no" WHERE serverId = "${message.guild.id}"`);
                            } else {
                                const embed = new Discord.RichEmbed()
			                            .setDescription("Kick Logging Enabled")
			                            message.channel.send({embed});
                                sql.run(`UPDATE modlog SET logKicks = "yes" WHERE serverId = "${message.guild.id}"`);
                            }
                        }
                    });

                }
            } else if(args[0] === "setchannel"){

                sql.get(`SELECT * FROM modlog WHERE serverId ="${message.guild.id}"`).then(row => {
                    if(!row){
                        const embed = new Discord.RichEmbed()
			                .setColor(0xF46242)
			                .setDescription("Use k?modlog toggle to enable module")
			                message.channel.send({embed});
                    } else {
                        if(args[1]){
                            var channelID = args[1].replace("<#", "").replace(">", "");
                            sql.run(`UPDATE modlog SET channel = "${channelID}" WHERE serverId = "${message.guild.id}"`);
                            //confirmation
                            const embed = new Discord.RichEmbed()
			                .setDescription(`Public log set to <#${channelID}> (${channelID})`)
			                message.channel.send({embed});
                        }
                    }
                });


            }

        } else {
            const embed = new Discord.RichEmbed()
            .setColor(0xF46242)
            .setDescription("You don't have permission to use this\n```KICK_MEMBERS Required```")
            message.channel.send({embed});
        }
    }

    exports.conf = {
        DM: true,
        OwnerOnly: false,
        alias: []
    }