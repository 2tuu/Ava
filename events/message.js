const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

exports.run = (deletedMessage, sql, client, message) => {

    //Command use calculator, will be remade and enabled when profiles are fixed
    sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {
        if(!message.author.bot){
          if(!row){

          } else {
            //sql.run(`UPDATE profile SET cmds = "${parseFloat(row.cmds) + 0.1}" WHERE userId = "${message.author.id}"`);
          }
        }
      });

      if(!message.guild) return;

      sql.get(`SELECT * FROM announce WHERE guild ="${message.guild.id}"`).then(row => {
        if(!row){
          sql.run("INSERT INTO announce (guild, channel) VALUES (?, ?)", [message.guild.id, null]);
          console.log("added to announcement");
        }
      });
	
  }
