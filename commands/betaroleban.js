const Discord = require("discord.js");

exports.run = (client, message, args, deletedMessage, sql, tossedSet, roles) => {

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
    
    
    
    
    if(!message.member.permissions.has('BAN_MEMBERS')) {
        const embed = new Discord.RichEmbed()
        .setColor(0xF46242)
        .setTimestamp()
        .setTitle("Sorry, you don't have permission to use this. (BAN_MEMBERS Required)")
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
        } else if(args[0] === "off"){
            sql.run(`UPDATE settings SET banId = "null" WHERE serverId = "${message.guild.id}"`);
    
                const embed = new Discord.RichEmbed()

                .setDescription("Role removed")
                return message.channel.send({embed});
        } else {

            var time;

            if(args[1]){
            if(!isNaN(args[1].replace("h", "").replace("m", ""))){

                rawTime = args[1].replace("h", "").replace("m", "");

                if(args[1].endsWith("h")){
                    time = rawTime * 3600000;
                } else if(args[1].endsWith("m")){
                    time = rawTime * 6000;
                } else {
                    return message.channel.send("Invalid time format, use:\n`k?roleban @user 1h` for one hour\n`k?roleban @user 1m` for one minute");
                }
            }
            }


            var argVar = args[0].replace("<@", "").replace("!", "").replace(">", "");
            var  roleVar = message.guild.members.find("id", argVar);
    
            if(!roleVar){
                const embed = new Discord.RichEmbed()
                    .setColor(0xF46242)
                    .setTimestamp() //Write to JSON
                    .setTitle("Mention or ID invalid")
                    return message.channel.send({embed});
            } else {

            if(tossedSet.has(roleVar.id + "-" + message.guild.id)){
                const embed = new Discord.RichEmbed()
                .setColor(0xF46242)
                .setDescription("This member is already rolebanned")
                return message.channel.send({embed});
            }
    
            sql.get(`SELECT * FROM settings WHERE serverId ="${message.guild.id}"`).then(row => {
        
                async function profileA(){
                    if (!row) {
                        console.log("first");
                        await sql.run("INSERT INTO settings (serverId, banId) VALUES (?, ?)", [message.guild.id, "null"]);
                    } 
                }
                
                profileA();

                if(row.banId === "null") return;
     
                var allroles = roleVar.roles;
                roles[message.guild.id + "-" + argVar] = {
                    roles: allroles
                  };
    
                  if(tossedSet.has(roleVar.id + "-" + message.guild.id)){
                    const embed = new Discord.RichEmbed()
                    .setColor(0xF46242)
                    .setDescription("This member is already rolebanned")
                    return message.channel.send({embed});
                  } else {
                    tossedSet.add(roleVar.id + "-" + message.guild.id);
                roleVar.removeRoles(roleVar.roles).then(() => {
                    roleVar.addRole(row.banId).then(() => {
    
                        function timedRoleBan(t){

                        	setTimeout(() => {


                         
                                    await roleVar.addRoles(roles[message.guild.id + "-" + argVar].roles).then(() => {
                                        delete roles[message.guild.id + "-" + argVar];
                                        tossedSet.delete(roleVar.id + "-" + message.guild.id);
                                        
                                    }).catch((err) => {
                                        //message.channel.send("An error occured while restoring roles: " + err);
                                    });
                        
                                    if(roleVar.roles.find("id", row.banId)){
                                        await roleVar.removeRole(row.banId).catch((err) => {
                                            console.error(err);
                                        });
                                    }
                                

	                        }, t);

                        }

                        if(!isNaN(time)){
                            timedRoleBan(time);
                        }

                    const embed = new Discord.RichEmbed()

                        .setDescription("Member has been rolebanned")
                    return message.channel.send({embed});

    
                }).catch((err) => {
                    message.channel.send("The rolebanned role doesn't seem to be available");
                });

                }).catch((err) => {
                    tossedSet.delete(roleVar.id + "-" + message.guild.id);

                    const embed = new Discord.RichEmbed()
                    .setColor(0xF46242)
                    .setTimestamp() //Write to JSON
                    .setTitle("I don't have permission")
                    .setFooter(err)
                    return message.channel.send({embed});

                });
            }
                //log(row.userID);
            }).catch((err) => {
                return console.error(err);
            });
        }
        }
    
    }
    }
    
    exports.conf = {
        DM: true,
        OwnerOnly: false
    }