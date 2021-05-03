const Discord = require("discord.js");

exports.run = (client, message, args, deletedMessage, pool) => {

       pool.query(`SELECT * FROM prefixes WHERE serverId ='${message.guild.id}'`).then(row => {
         row = row.rows;
        if(!row[0]){
          sql.run(`INSERT INTO prefixes (prefix, welcomeMessage, welcomeChannel, shouldWelcome, serverId) VALUES ('k?', 'This is a placeholder', 'null', 'false', '${message.guild.id}')`);
          console.log("added to prefixes");
        }

        if(message.member.permissions.has('ADMINISTRATOR') || message.author.id === "378769654942007299"){
            if(args.length === 0){
              return message.channel.send("Please enter a valid prefix");
              }
        
                pool.query(`UPDATE prefixes SET prefix = '${args[0].replace("\"", "").replace("\"", "")}' WHERE serverId = '${message.guild.id}'`);

                const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setTitle("Server prefix changed to: \"" + args[0].replace("\"", "").replace("\"", "") + "\"")
                message.channel.send({embed});
            
                console.log('\x1b[36m%s\x1b[0m', "Server prefix for GUILD ID: " + message.guild.id);
                console.log('\x1b[36m%s\x1b[0m', "Changed to: " + args[0]);

            } else {
              const embed = new Discord.MessageEmbed()
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
  help: "Set my prefix to be used in this server",
  format: "k?prefix [prefix]",
  DM: false,
  OwnerOnly: false,
  alias: ['setprefix']
}