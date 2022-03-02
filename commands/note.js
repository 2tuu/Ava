const Discord = require("discord.js");
const config = require("./../config.json");
var pLength = config.prefix.length;

exports.run = (client, message, args, deletedMessage, sql) => {


  var argV = message.content.slice(pLength).trim().split(/ +/g);
  argV = argV.slice(1);

  if (args[0] === "create") {

    sql.query(`SELECT * FROM note WHERE ownerid ='${message.author.id}'`).then(row => {
      row = row.rows[0];

      if (!row) {
        sql.query(`INSERT INTO note (note, ownerId) VALUES ('', ${message.author.id})`);
        const embed = new Discord.MessageEmbed()
          .setDescription("Note created")
        return client.messageHandler(message, client.isInteraction, { embed });
      } else {
        const embed = new Discord.MessageEmbed()
          .setColor(0xF46242)
          .setDescription("You already have a note")
        return client.messageHandler(message, client.isInteraction, { embed });
      }


    }).catch((err) => {
      console.error(err);
    });

  } else if (args[0] === "append") {

    sql.query(`SELECT * FROM note WHERE ownerid ='${message.author.id}'`).then(row => {
      row = row.rows[0];
      if (!row) {
        const embed = new Discord.MessageEmbed()
          .setColor(0xF46242)
          .setDescription("You don't have a note")
        return client.messageHandler(message, client.isInteraction, { embed });
      } else {

        if (`${row.note + "\n" + argV.slice(1).join(' ').replace(new RegExp(`"`, `g`), `''`)}`.length > 2000) {
          const embed = new Discord.MessageEmbed()
            .setColor(0xF46242)
            .setDescription("Appended note exceeds character limit (2000 characters)")
          return client.messageHandler(message, client.isInteraction, { embed });
        } else {
          sql.query(`UPDATE note SET note = '${row.note + "\n" + argV.slice(1).join(' ').replace(new RegExp(`"`, `g`), `''`)}' WHERE ownerId = '${message.author.id}'`);
          client.messageHandler(message, client.isInteraction, `\`${argV.slice(1).join(' ')}\` Added to note`)
        }
      }
    }).catch((err) => {
      console.error(err);

    });

  } else if (args[0] === "edit") {

    sql.query(`SELECT * FROM note WHERE ownerid ='${message.author.id}'`).then(row => {
      row = row.rows[0];

      if (!row) {
        const embed = new Discord.MessageEmbed()
          .setColor(`0x${client.colors.bad}`)
          .setDescription("You don't have a note")
        return client.messageHandler(message, client.isInteraction, { embed });
      } else {
        sql.query(`UPDATE note SET note = '${argV.slice(1).join(' ').replace(new RegExp("{n}", 'g'), "\n").replace(new RegExp(`"`, 'g'), `''`)}' WHERE ownerId ='${message.author.id}'`);
        const embed = new Discord.MessageEmbed()
          .setColor(`0x${client.colors.good}`)
          .setDescription("Note updated")
        return client.messageHandler(message, client.isInteraction, { embed });
      }

    }).catch((err) => {
      console.error(err);

    });

  } else if (args[0] === "clear") {

    sql.query(`SELECT * FROM note WHERE ownerid ='${message.author.id}'`).then(row => {
      row = row.rows[0];

      if (!row) {
        const embed = new Discord.MessageEmbed()
          .setColor(`0x${client.colors.bad}`)
          .setDescription("You don't have a note")
        return client.messageHandler(message, client.isInteraction, { embed });
      } else {

        sql.query(`UPDATE note SET note = '' WHERE ownerid ='${message.author.id}'`);
        const embed = new Discord.MessageEmbed()
          .setDescription("Note cleared")
        return client.messageHandler(message, client.isInteraction, { embed });
      }

    }).catch((err) => {
      console.error(err);

    });

  } else if (!args[0]) {

    sql.query(`SELECT * FROM note WHERE ownerid ='${message.author.id}'`).then(row => {
      row = row.rows[0];

      if (!row) {
        const embed = new Discord.MessageEmbed()
          .setColor(`0x${client.colors.bad}`)
          .setDescription("You don't have a note")
        return client.messageHandler(message, client.isInteraction, { embed });
      } else {

        if (row.note.length > 0) {
          var rowNote = row.note;
        } else {
          var rowNote = "Note is empty";
        }
        client.messageHandler(message, client.isInteraction, '```py\nNote: ' + message.author.tag + '\n```');
        client.messageHandler(message, client.isInteraction, '```md\n' + rowNote + '\n```');
      }

    }).catch((err) => {
      console.error(err);

    });

  } else {
    //invalid sub command
  }


}

exports.conf = {
  category: "Utility",
  name: "Note",
  help: "Create a note, view a note or edit it",
  format: "k?note {append/edit}",
  DM: true,
  ownerOnly: false,
  alias: [],
  slashCommand: false //fix output
}
