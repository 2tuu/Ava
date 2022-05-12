const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./plugins/data.json", "utf8"));
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

exports.run = async (deletedMessage, pool, client, message) => {

  if (message.guild) {
    pool.query(`SELECT * FROM password WHERE serverid ='${message.guild.id}'`).then(row => {
      if (!message.author.bot) {
        if (row.rows[0]) {
          row = row.rows[0];

          var isChannel = (row.channel === message.channel.id); //true if channel is correct
          var isRole = (!message.member.roles.cache.map(a => a.id).includes(row.role)); //true if member doesn't have role already
          var passCorrect = (row.password === message.content);

          if (isChannel) {
            if (isRole) {
              //check for password
              if (passCorrect) {
                role = message.guild.roles.cache.find(r => r.id === row.role);
                if (role) {
                  //add role
                  message.member.roles.add(role);
                  message.delete();
                } else {
                  //if role is missing
                  message.channel.send('It looks like the role is missing from the server, please let a moderator know');
                  message.delete();
                }
              } else {
                //delete and ignore for being incorrect
                message.delete();
              }
            } else {
              //ignore and delete message for already having role
              message.delete();
            }
          }
        }
      }
    });
  }

  //database checkers
  if (!message.guild) return;
  pool.query(`SELECT * FROM prefixes WHERE serverId ='${message.guild.id}'`).then(row => {
    if (!row.rows[0]) {
      console.log(`=> Updated prefixes table (${message.guild.id})`)
      pool.query(`INSERT INTO prefixes (prefix, welcomeMessage, welcomeChannel, shouldWelcome, serverId) VALUES ('${config.prefix}', 'This is a placeholder welcome message', 'null', 'false', '${message.guild.id}')`);
    }
  });
  pool.query(`SELECT * FROM reactionroles WHERE serverid ='${message.guild.id}'`).then(row => {
    if (!row.rows[0]) {
      console.log(`=> Updated reactionroles table (${message.guild.id})`)
      pool.query(`INSERT INTO reactionroles (serverid, roles, messageid) VALUES ('${message.guild.id}','{}','null')`);
    }
  });
  pool.query(`SELECT * FROM giverole WHERE serverid ='${message.guild.id}'`).then(row => {
    if (!row.rows[0]) {
      console.log(`=> Updated giverole table (${message.guild.id})`)
      pool.query(`INSERT INTO giverole (serverid, rolearray) VALUES ('${message.guild.id}', '')`);
    }
  });
  pool.query(`SELECT * FROM xban WHERE serverid ='${message.guild.id}'`).then(row => {
    if (!row.rows[0]) {
      console.log(`=> Updated xban table (${message.guild.id})`)
      pool.query(`INSERT INTO xban (serverid, userarray) VALUES ('${message.guild.id}', '')`);
    }
  });

  pool.query(`SELECT * FROM xban WHERE serverid ='${message.guild.id}'`).then(row => {
    row = row.rows[0];
    if (!row) return;

    var bannedUsers = row.userarray.split(',');

    if (bannedUsers.includes(message.author.id)) {
      message.member.ban({ reason: `Automated ban by ${client.user.tag}` }).catch(error => { 
        //ignore, this will clog the log if permissions are wrong
      });
    }

  });

  var currentStatus = await client.presence.activities;
  if (!currentStatus[0]) {
    client.user.setActivity(data.status);
    console.log('Automatically set status to: ' + data.status);
  }

}