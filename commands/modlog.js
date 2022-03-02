const Discord = require('discord.js');

    exports.run = (client, message, args, deletedMessage, sql) => {

        if(!args || !args[0]){
            const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.bad}`)
            .setDescription("Please check the help documentation")
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }

        if(message.member.permissions.has('KICK_MEMBERS') || message.author.id === '378769654942007299') {
            //continue
        }else{
            const embed = new Discord.MessageEmbed()
            .setColor(`0x${client.colors.bad}`)
            .setDescription("You don't have permission to use this\n```KICK_MEMBERS Required```")
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }

            if(args[1]){ args[1] = args[1].toLowerCase(); }

            function optionApply(option, setting){
                option = option.toLowerCase();
                setting = setting.toLowerCase();

                if(option === 'ignore'){
                    sql.query(`SELECT * FROM modlog WHERE serverid ='${message.guild.id}'`).then(row => {
                        row = row.rows[0];
                        if(!row) return;

                        if(!row.ignore) row.ignore = ''; //for old db entries
                        var ignoredChannels = row.ignore.split(',');

                        if(args[1].toLowerCase() === 'list'){
                            res = 'Ignored Channels:\n' + row.ignore.split(',').join('\n');
                            const embed = new Discord.MessageEmbed()
                            .setDescription("```" + res + "```")
                            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                        }

                        if(!setting) return client.messageHandler(message, client.isInteraction, "I need a channel to ignore");
                        var channelToIgnore = setting.replace('<#','').replace('>','');

                        var res = message.guild.channels.cache.find(r => r.id === channelToIgnore);
                        if(!res) return client.messageHandler(message, client.isInteraction, "Sorry, I can't find that channel");

                        if(ignoredChannels.includes(channelToIgnore)){
                            ignoredChannels = ignoredChannels.filter(e => e !== res.id).join(',');
                            client.messageHandler(message, client.isInteraction, `<#${res.id}> has been removed from the list`);

                            sql.query(`UPDATE modlog SET ignore = '${ignoredChannels}' WHERE serverid ='${message.guild.id}'`);
                        } else {
                            ignoredChannels.push(res.id);
                            client.messageHandler(message, client.isInteraction, `<#${res.id}> has been added to the list`);

                            sql.query(`UPDATE modlog SET ignore = '${ignoredChannels}' WHERE serverid ='${message.guild.id}'`);
                        }

                    });
                } else if(option === 'toggle'){
                    sql.query(`SELECT * FROM modlog WHERE serverId ='${message.guild.id}'`).then(row => {
                        row = row.rows[0];
                        if(!row){
                            sql.query(`INSERT INTO modlog (logkicks, logreactions, logchannels, logemojis, logbans, logleaves, logmembers, logmessages, logroles, serverid, enabled, channel, ignore) VALUES ('no', 'no','no','no','no','no','no','no','no', '${message.guild.id}','yes',null,'')`);
                            const embed = new Discord.MessageEmbed()
                                .setColor(`0x${client.colors.good}`)
                                .setDescription("Modlog module Enabled")
                            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                        } else {
                            if(row.enabled === "yes"){
                                    const embed = new Discord.MessageEmbed()
                                       .setColor(`0x${client.colors.bad}`)
			                            .setDescription("Modlog module Disabled")
			                            client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                                sql.query(`UPDATE modlog SET enabled = 'no' WHERE serverId = '${message.guild.id}'`);
                            } else {
                                    const embed = new Discord.MessageEmbed()
                                        .setColor(`0x${client.colors.good}`)
                                        .setDescription("Modlog module Enabled")
                                        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
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
                            'logchannels',
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
                                .setColor(`0x${client.colors.good}`)
                                .setDescription(setting + " module enabled.")
                                client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                                sql.query(`UPDATE modlog SET ${setting} = 'yes' WHERE serverId = '${message.guild.id}'`);
                            } else {
                                //set no
                                const embed = new Discord.MessageEmbed()
                                .setColor(`0x${client.colors.bad}`)
                                .setDescription(setting + " module disabled.")
                                client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                                sql.query(`UPDATE modlog SET ${setting} = 'no' WHERE serverId = '${message.guild.id}'`);
                            }
                        } else {
                            const embed = new Discord.MessageEmbed()
                                .setColor(`0x${client.colors.bad}`)
                                .setDescription('Invalid setting')
                                client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                        }
                    });
                }
            }
            //end script
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
                            .setColor(`0x${client.colors.good}`)
			                .setDescription(`Mod log set to <#${channelID}> (${channelID})`)
			                client.messageHandler(message, client.isInteraction, { embeds: [embed] });
                        }
                });
            }

    }

    /*k?modlog toggle [logKicks/logChannels/logLeaves/logBans/logMembers/logMessages]
k?modlog toggle
k?modlog setchannel [#channel]
k?modlog ignore #channel*/

    exports.conf = {
        category: "Moderation",
        name: "Modlog",
        help: "Manage the mod logging modules",
        shortHelp: "Modlog configuration",
        format: "k?modlog toggle [logKicks/logChannels/logLeaves/logBans/logMembers/logMessages]\nk?modlog toggle\nk?modlog setchannel [#channel]\nk?modlog ignore #channel",
        DM: false,
        ownerOnly: false,
        alias: [],
  slashCommand: true,
  data:{
          name: 'modlog',
          description: 'Modlog module configuration',
          options: [
              {
                  choices: [
                      { name: 'toggle-ban-logging', value: 'toggle logbans' },
                      { name: 'toggle-kick-logging', value: 'toggle logkicks' },
                      { name: 'toggle-channel-logging', value: 'toggle logchannels' },
                      { name: 'toggle-leave-logging', value: 'toggle logleaves' },
                      { name: 'toggle-member-logging', value: 'toggle logmembers' },
                      { name: 'toggle-message-logging', value: 'toggle logmessages' },
                      { name: 'set-channel', value: 'setchannel' },
                      { name: 'ignore-channel', value: 'ignore' },
                  ],
                  autocomplete: undefined,
                  type: 3,
                  name: 'setting',
                  description: 'What setting to change',
                  required: true
              },
              {
                  choices: undefined,
                  autocomplete: false,
                  type: 3,
                  name: 'channel',
                  description: 'Channel to ignore or use as the mod log',
                  required: false
                }
          ],
          default_permission: undefined
      }
    }