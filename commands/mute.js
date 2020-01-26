const Discord = require("discord.js");
//const unroleban = require("./silentunroleban.js");

/*
                        if(args.join(' ').match(/-t (.*)/g)){

                            function getSeconds(str) {
                                var seconds = 0;
                                var days = str.match(/(\d+)\s*d/);
                                var hours = str.match(/(\d+)\s*h/);
                                var minutes = str.match(/(\d+)\s*m/);
                                if (days) { seconds += parseInt(days[1])*86400; }
                                if (hours) { seconds += parseInt(hours[1])*3600; }
                                if (minutes) { seconds += parseInt(minutes[1])*60; }
                                return seconds * 1000;
                              }

                            var num = args.join(' ').match(/-t (.*)/g)[0].replace('-t ', '');
                            num = getSeconds(num.toString());
                            if(isNaN(num) || num < 1){
                                return message.channel.send('The time given was invalid, use `-t #h #m`\nThe member was rolebanned normally');
                            } else {
                                //help me
                                setTimeout(() => {
                                unroleban.run(client, message, [roleVar.id], deletedMessage, sql, tossedSet, roles);
                                }, num);
                            }
                        }
*/

exports.run = async (client, message, args, deletedMessage, sql, tossedSet, roles) => {

    if(!args[0]) return message.channel.send('Please enter a user ID or mention');

    try{


    sql.get(`SELECT * FROM settings WHERE serverId ="${message.guild.id}"`).then(row => {
        async function profileA(){
        if (!row) {
            console.log("first");
            await sql.run("INSERT INTO settings (serverId, banId) VALUES (?, ?)", [message.guild.id, "null"]);
        } 
    }
    
    profileA();
    
    }).catch((err) => {
        message.channel.send('err: ' + err)
    });
    
    
    
    
    if(!message.member.permissions.has('MANAGE_ROLES')) {
        const embed = new Discord.RichEmbed()
        .setColor(0xF46242)
        .setTimestamp()
        .setTitle("Sorry, you don't have permission to use this. (MANAGE_ROLES Required)")
        return message.channel.send({embed});
    } else {
    
        if(args[0] === "roleadd"){
    
            sql.get(`SELECT * FROM settings WHERE serverId ="${message.guild.id}"`).then(row => {
                
                if (!row) {
                    console.log("second");
                    sql.run("INSERT INTO settings (serverId, banId) VALUES (?, ?)", [message.guild.id, "null"]);
                } 
            
                var tossedRole = message.guild.roles.find("name", args[1]);
    
                if(!tossedRole){
                    const embed = new Discord.RichEmbed()
                    .setColor(0xF46242)
                    .setTimestamp() //Write to JSON
                    .setTitle("A role with this name was not found")
                    return message.channel.send({embed});
                } else {
    
                sql.run(`UPDATE settings SET banId = "${tossedRole.id}" WHERE serverId = "${message.guild.id}"`).then(()=>{
                    const embed = new Discord.RichEmbed()

                .setDescription("Role added")
                 message.channel.send({embed});
                }).catch((err)=>{
    
                    const embed = new Discord.RichEmbed()
                    .setColor(0xF46242)
                    .setTimestamp() //Write to JSON
                    .setTitle("An error occured")
                    .setFooter(err)
                    return message.channel.send({embed});
                });
                
            }
            }).catch(() => {
    
            });
        } else {
            var argVar = args[0].replace("<@", "").replace("!", "").replace(">", "");
            var  member = message.guild.members.get(argVar);
            
            if(!member){
                //invalid ID
            } else {
                var db = await sql.get(`SELECT * FROM settings WHERE serverId ="${message.guild.id}"`);

                if(!db.banId || !db || !message.guild.roles.get(db.banId)){
                    message.channel.send('A muted role is not set, or the one you did set is invalid');
                } else {
                    //add role or remove role
                    try{
                        
                        if(member.roles.map(r=>r.id).includes(db.banId)){ //already has role, remove
                            //Removed role
                            const embed = new Discord.RichEmbed()
                                .setDescription(member.user.tag + " has been unmuted")
                            message.channel.send({embed});

                            member.removeRole(db.banId);
                        } else {
                            //Added role
                            const embed = new Discord.RichEmbed()
                                .setDescription(member.user.tag + " has been muted")
                            message.channel.send({embed});
                            member.addRole(db.banId);
                        }

                        
                        if(args.join(' ').match(/-t (.*)/g)){

                            function getSeconds(str) {
                                var seconds = 0;
                                var days = str.match(/(\d+)\s*d/);
                                var hours = str.match(/(\d+)\s*h/);
                                var minutes = str.match(/(\d+)\s*m/);
                                if (days) { seconds += parseInt(days[1])*86400; }
                                if (hours) { seconds += parseInt(hours[1])*3600; }
                                if (minutes) { seconds += parseInt(minutes[1])*60; }
                                return seconds * 1000;
                              }

                            var num = args.join(' ').match(/-t (.*)/g)[0].replace('-t ', '');
                            num = getSeconds(num.toString());
                            if(isNaN(num) || num < 1){
                                return message.channel.send('The time given was invalid, use `-t #h #m`\nThe member was muted normally');
                            } else {
                                //help me
                                setTimeout(() => {
                                member.removeRole(db.banId).catch((err)=>{console.error(err.stack)});
                                }, num);
                            }
                        }
        
                    } catch(err){
                        //error giving or taking role
                        message.channel.send('There was an error muting this member, do I have permission?\n```js\n' + err + '\n```')
                    }
                }
            }

        }
    
    }

} catch(err){
    message.channel.send(`An error occured, please report this to the developers: \`\`\`js\n${err.stack}\`\`\``)
}

    }
    
    exports.conf = {
        DM: true,
        OwnerOnly: false
    }
