const Discord = require("discord.js");
exports.run = (client, message, args) => {
  if (!args[1]){
    const embed = new Discord.MessageEmbed()
      .addField("Description", client.help['choose'].help)
      .addField("Usage", '```' + client.help['choose'].format + '```')
    return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
  }
  var response = args[Math.floor(Math.random() * args.length)];
  response = response.replace(new RegExp('"', 'g'), '');
  client.messageHandler(message, client.isInteraction, "I choose **" + response + "**")
}

exports.conf = {
  name: "Choose",
  help: "Choose between multiple things",
  format: "k?choose [thing1] [thing2] {thing3}...\nUse quotation marks for things with multiple words",
  DM: true,
  ownerOnly: false,
  alias: [],
  slashCommand: true,
  data: {
    name: "choose",
    description: "Choose between multiple things",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'choices',
        description: 'What you want the bot to choose between',
        required: true
      }
    ],
    default_permission: undefined
  }
}