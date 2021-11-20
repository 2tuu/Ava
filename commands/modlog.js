const Discord = require('discord.js');

    exports.run = (client, message, args, deletedMessage, sql) => {
        if(message.member.permissions.has('KICK_MEMBERS') || message.author.id === '378769654942007299') {
            //continue
        }else{
            const embed = new Discord.MessageEmbed()
            .setColor(0xF46242)
            .setDescription("You don't have permission to use this\n```KICK_MEMBERS Required```")
            return message.channel.send({embed});
        }

            if(args[1]){ args[1] = args[1].toLowerCase(); }

            function optionApply(option, setting){
                //option = args[0], setting = args[1]
                option = option.toLowerCase();
                setting = setting.toLowerCase();
                //option exchange for args[0], repeat
                if(option === 'ignore'){
                    sql.query(`SELECT * FROM modlog WHERE serverid ='${message.guild.id}'`).then(row => {
                        row = row.rows[0];
                        if(!row) return;

                        if(!row.ignore) row.ignore = ''; //for old db entries
                        var ignoredChannels = row.ignore.split(',');

                        if(args[1].toLowerCase() === 'list'){
                            res = 'Ignored Channels:\n' + row.ignore.split(',').join('\n');
                            const embed = new Discord.MessageEmbed()
                            .setColor(0xFFF200)
                            .setDescription("```" + res + "```")
                            return message.channel.send({embed});
                        }

                        if(!setting) return message.channel.send("I need a channel to ignore");
                        var channelToIgnore = setting.replace('<#','').replace('>','');

                        var res = message.guild.channels.cache.find(r => r.id === channelToIgnore);
                        if(!res) return message.channel.send("Sorry, I can't find that channel");

                        if(ignoredChannels.includes(channelToIgnore)){
                            ignoredChannels = ignoredChannels.filter(e => e !== res.id).join(',');
                            message.channel.send(`<#${res.id}> has been removed from the list`);

                            sql.query(`UPDATE modlog SET ignore = '${ignoredChannels}' WHERE serverid ='${message.guild.id}'`);
                        } else {
                            ignoredChannels.push(res.id);
                            message.channel.send(`<#${res.id}> has been added to the list`);

                            sql.query(`UPDATE modlog SET ignore = '${ignoredChannels}' WHERE serverid ='${message.guild.id}'`);
                        }

                    });
                } else if(option === 'toggle'){
                    //toggle code here
                    sql.query(`SELECT * FROM modlog WHERE serverId ='${message.guild.id}'`).then(row => {
                        row = row.rows[0];
                        if(!row){
                            sql.query(`INSERT INTO modlog (logkicks, logreactions, logchannels, logemojis, logbans, logleaves, logmembers, logmessages, logroles, serverid, enabled, channel, ignore) VALUES ('no', 'no','no','no','no','no','no','no','no', '${message.guild.id}','yes',null,'')`);
                            const embed = new Discord.MessageEmbed()
                                    .setDescription("Modlog module Enabled")
                                    return message.channel.send({embed});
                        } else {
                            if(row.enabled === "yes"){
                                console.log(row.enabled);
                                    const embed = new Discord.MessageEmbed()
			                            .setColor(0xF46242)
			                            .setDescription("Modlog module Disabled")
			                            message.channel.send({embed});
                                sql.query(`UPDATE modlog SET enabled = 'no' WHERE serverId = '${message.guild.id}'`);
                            } else {
                                console.log(row.enabled);
                                    const embed = new Discord.MessageEmbed()
                                        .setDescription("Modlog module Enabled")
                                        message.channel.send({embed});
                                sql.query(`UPDATE modlog SET enabled = 'yes' WHERE serverId = '${message.guild.id}'`);
                            }
                        }
                    });
                } else if(option === "setchannel"){
                    sql.query(`SELECT * FROM modlog WHERE serverid ='${message.guild.id}'`).then(row => {
                        row = row.rows[0];
                        if(!row) return;
                    //set channel variable here, but only if enabled
                    });
                } else if(option === "toggleoption"){
                    sql.query(`SELECT * FROM modlog WHERE serverid ='${message.guild.id}'`).then(row => {
                        row = row.rows[0];
                        if(!row) return;
                        //remember to feed this option if args[1] exists, top if only args[0]
                        var optionlist = [
                            'logkicks',
                            'logreactions',
                            'logchannels',
                            'logemojis',
                            'logbans',
                            'logleaves',
                            'logmembers',
                            'logmessages',
                            'logroles'];
                        //toggle individual options
                        if(optionlist.includes(setting)){
                            if(row[setting] === 'no'){
                                //set yes
                                const embed = new Discord.MessageEmbed()
                                .setDescription(setting + " module enabled.")
                                message.channel.send({embed});
                                sql.query(`UPDATE modlog SET ${setting} = 'yes' WHERE serverId = '${message.guild.id}'`);
                            } else {
                                //set no
                                const embed = new Discord.MessageEmbed()
                                .setColor(0xF46242)
                                .setDescription(setting + " module disabled.")
                                message.channel.send({embed});
                                sql.query(`UPDATE modlog SET ${setting} = 'no' WHERE serverId = '${message.guild.id}'`);
                            }
                        } else {
                            const embed = new Discord.MessageEmbed()
                                .setColor(0xF46242)
                                .setDescription('Invalid setting')
                                message.channel.send({embed});
                        }
                    });
                }
            }
            //end script

            //replace this with a switch statement later
            if(args[0].toLowerCase() === "toggle"){
                if(!args[1]){
                    
                    optionApply('toggle', 'n/a');

                } else {
                    optionApply('toggleoption', args[1]);
                }
            } else if(args[0].toLowerCase() === "ignore") {
                optionApply('ignore', args[1]);
            } else if(args[0].toLowerCase() === "setchannel"){

                sql.query(`SELECT * FROM modlog WHERE serverId ='${message.guild.id}'`).then(row => {
                    row = row.rows[0];
                    if(!row) return;

                        if(args[1]){
                            var channelID = args[1].replace("<#", "").replace(">", "");
                            sql.query(`UPDATE modlog SET channel = '${channelID}' WHERE serverId = '${message.guild.id}'`);
                            //confirmation
                            const embed = new Discord.MessageEmbed()
			                .setDescription(`Public log set to <#${channelID}> (${channelID})`)
			                message.channel.send({embed});
                        }
            
                });


            }

    }

    exports.conf = {
        category: "Moderation",
        name: "Modlog",
        help: "Manage the mod logging modules",
        format: "k?modlog toggle [logKicks/logEmojis/logChannels/logLeaves/logBans/logMembers/logMessages/logReactions]\nk?modlog toggle\nk?modlog setchannel [#channel]",
        DM: false,
        OwnerOnly: false,
        alias: []
    }