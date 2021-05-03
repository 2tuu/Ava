const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

exports.run = (deletedMessage, pool, client, message) => {
      if(!message.guild) return;
      pool.query(`SELECT * FROM prefixes WHERE serverId ='${message.guild.id}'`).then(row => {
        if(!row.rows){
          pool.query(`INSERT INTO prefixes (prefix, welcomeMessage, welcomeChannel, shouldWelcome, serverId) VALUES ('${config.prefix}', 'This is a placeholder welcome message', 'null', 'false', '${message.guild.id}')`);
          console.log("added to prefixes");
        }
      });

      pool.query(`SELECT * FROM announce WHERE guild ='${message.guild.id}'`).then(row => {
        if(!row.rows){
          pool.query(`INSERT INTO announce (guild, channel) VALUES ('${message.guild.id}', null)`);
          console.log("added to announcement");
        }
      });

  }
