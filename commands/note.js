const Discord = require("discord.js");
const config = require("./../config.json");
var pLength = config.prefix.length;

exports.run = (client, message, args, deletedMessage, sql) => {


  var argV = message.content.slice(pLength).trim().split(/ +/g);
  argV = argV.slice(1);

    sql.run("CREATE TABLE IF NOT EXISTS notes (note BLOB, ownerId TEXT)");

    if(args[0] === "create"){

        var row = sql.get(`SELECT * FROM notes WHERE ownerId ="${message.author.id}"`);

            if (!row) {
              sql.run(`INSERT INTO notes (note, ownerId) VALUES ("", ${message.author.id})`);
              const embed = new Discord.MessageEmbed()
              .setDescription("Note created")
              return message.channel.send({embed});
              } else {
                const embed = new Discord.MessageEmbed()
                   .setColor(0xF46242)
                   .setDescription("You already have a note")
                   return message.channel.send({embed});
              }
        
    
    
//don't change
    } else if(args[0] === "append"){

        var row = sql.get(`SELECT * FROM notes WHERE ownerId ="${message.author.id}"`);

            if (!row) {
              const embed = new Discord.MessageEmbed()
                   .setColor(0xF46242)
                   .setDescription("You don't have a note")
                   return message.channel.send({embed});
              } else {

                if(`${row.note + "\n" + argV.slice(1).join(' ').replace(new RegExp(`"`, `g`), `''`)}`.length > 2000){
                  const embed = new Discord.MessageEmbed()
                   .setColor(0xF46242)
                   .setDescription("Appended note exceeds character limit (2000 characters)")
                   return message.channel.send({embed});
                } else {
                sql.run(`UPDATE notes SET note = "${row.note + "\n" + argV.slice(1).join(' ').replace(new RegExp(`"`, `g`), `''`)}" WHERE ownerId = "${message.author.id}"`);
                message.channel.send(`\`${argV.slice(1).join(' ')}\` Added to note`)
                }
              }     

    } else if(args[0] === "edit"){

        var row = sql.get(`SELECT * FROM notes WHERE ownerId ="${message.author.id}"`);

            if (!row) {
              const embed = new Discord.MessageEmbed()
                   .setColor(0xF46242)
                   .setDescription("You don't have a note")
                   return message.channel.send({embed});
              } else {
                sql.run(`UPDATE notes SET note = "${argV.slice(1).join(' ').replace(new RegExp("{n}", 'g'), "\n").replace(new RegExp(`"`, 'g'), `''`)}" WHERE ownerId ="${message.author.id}"`);
                 const embed = new Discord.MessageEmbed()
                   .setDescription("Note updated")
                   return message.channel.send({embed});
              }


    }else if(args[0] === "clear"){

        var row = sql.get(`SELECT * FROM notes WHERE ownerId ="${message.author.id}"`);

            if (!row) {
              const embed = new Discord.MessageEmbed()
                   .setColor(0xF46242)
                   .setDescription("You don't have a note")
                   return message.channel.send({embed});
              } else {

                sql.run(`UPDATE notes SET note = ""`);
                 const embed = new Discord.MessageEmbed()
                   .setColor(0xF46242)
                   .setDescription("Note cleared")
                   return message.channel.send({embed});
              } 

    } else if(!args[0]){

        var row = sql.get(`SELECT * FROM notes WHERE ownerId ="${message.author.id}"`);

            if (!row) {
              const embed = new Discord.MessageEmbed()
                   .setColor(0xF46242)
                   .setDescription("You don't have a note")
                   return message.channel.send({embed});
              } else {

                if(row.note.length > 0){
                    var rowNote = row.note;
                } else {
                    var rowNote = "Note is empty";
                }
                message.channel.send('```py\nNote: ' + message.author.tag + '\n```');
                message.channel.send('```md\n' + rowNote + '\n```');
              } 


    } else {
        //invalid sub command
        return;
    }


}

exports.conf = {
  help: "Create a note, view a note or edit it",
  format: "k?note {create/append/edit}",
  DM: true,
  OwnerOnly: false,
  alias: []
}
