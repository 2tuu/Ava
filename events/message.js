const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

exports.run = (deletedMessage, sql, client, message) => {

      if(!message.guild) return;

      var row = sql.get(`SELECT * FROM announce WHERE guild ="${message.guild.id}"`)
        if(!row){
          sql.run(`INSERT INTO announce (guild, channel) VALUES (${message.guild.id}, ${null})`);
          console.log("added to announcement");
        }

  }
