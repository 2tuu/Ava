const Discord = require("discord.js");

exports.run = (client, message, args, deletedMessage, pool, tossedSet, roles, messageContent) => {
  var v = messageContent;

  var owoify = function (v) {

    //This command is the bane of my existence

    v = v.replace(/(?:r|l)/g, "w");
    v = v.replace(/(?:R|L)/g, "W");
    v = v.replace(/n([aeiou])/g, 'ny$1');
    v = v.replace(/N([aeiou])/g, 'Ny$1');
    v = v.replace(/N([AEIOU])/g, 'NY$1');
    v = v.replace(/ove/g, "uv");
    v = v.replace(/\?+/g, " owo;;?? ");

    var count = (v.match(/!/g) || []).length;
    var faces = [";;w;;", "owo", "uwu", ">w<", "=w="];
    var i;

    for (i = 0; i < count; i++) {
      v = v.replace("!", " " + faces[Math.floor(Math.random() * faces.length)] + " ");
    }
    return v;
  }

  if (!args[0]) {
    const embed = new Discord.MessageEmbed()
      .setTitle("What's this? (No arguments)")
      .setColor(`0x${client.colors.bad}`)
    return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
  }

  client.messageHandler(message, client.isInteraction, owoify(v));
}

exports.conf = {
  name: "OWO/UWU",
  help: "What's this?",
  format: "k?owo [text]",
  DM: false,
  ownerOnly: false,
  alias: ['uwu'],
  slashCommand: true,
  data: {
    name: "owo",
    description: "uwu",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'text',
        description: 'Text to translate',
        required: true
      }
    ],
    dm_permission: false
  }
}