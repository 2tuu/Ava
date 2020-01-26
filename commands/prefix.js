const Discord = require("discord.js");

exports.run = (client, message, args, deletedMessage, sql) => {
       //Check for permissions
       
       //return message.channel.send("Custom prefixes are disabled until the database is reworked.");

       sql.get(`SELECT * FROM prefixes WHERE serverId ="${message.guild.id}"`).then(row => {
        if(!row){
          sql.run("INSERT INTO prefixes (prefix, welcomeMessage, welcomeChannel, shouldWelcome, serverId) VALUES (?, ?, ?, ?, ?)", ["k?", "This is a placeholder", "null", "false", message.guild.id]);
          console.log("added to prefixes");
        }

        if(message.member.permissions.has('ADMINISTRATOR') || message.author.id === "378769654942007299"){
            sql.get(`SELECT * FROM prefixes WHERE serverId ="${message.guild.id}"`).then(row => {
            if(args.length === 0){
               message.channel.send("Please enter a valid prefix");
                return;
                }
        
                sql.run(`UPDATE prefixes SET prefix = "${args[0].replace("\"", "").replace("\"", "")}" WHERE serverId = ${message.guild.id}`);

                const embed = new Discord.RichEmbed()
                .setTimestamp()
                .setTitle("Server prefix changed to: \"" + args[0].replace("\"", "").replace("\"", "") + "\"")
                message.channel.send({embed});
            
                console.log('\x1b[36m%s\x1b[0m', "Server prefix for GUILD ID: " + message.guild.id);
                console.log('\x1b[36m%s\x1b[0m', "Changed to: " + args[0]);
                //Write to JSON
                
                });

            } else {
                const embed = new Discord.RichEmbed()
                .setColor(0xF46242)
                .setTimestamp()
                .setTitle("You do not have permission to do this. (Admin required)")
                message.channel.send({embed});
            
                 }


            }).catch(() => {
              console.error;
            });
    
       
}

exports.conf = {
  DM: true,
  OwnerOnly: false
}