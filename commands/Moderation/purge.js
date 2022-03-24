//fixed for new framework
const Discord = require("discord.js");

exports.run = (client, message, args) => {

  if (!args[0]) {
    const embed = new Discord.MessageEmbed()
      .addField("Description", client.help['purge'].help)
      .addField("Usage", '```' + client.help['purge'].format + '```')
    return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
  }

  try {

    if (args[0] === "bots") {
      async function purge() {
        return message.reply('Sorry, this function is currently disabled.')
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
          return message.reply("Sorry, you don't have permission to use this.");
        }

        var deleteCount = parseInt(args[1], 10);
        deleteCount = deleteCount + 7;

        message.channel.messages.fetch({ limit: deleteCount }).then(messages => {
          const botMessages = messages.filter(msg => msg.author.bot);
          message.channel.bulkDelete(botMessages, true).catch((err) => { client.messageHandler(message, client.isInteraction, "Error: " + err); });
          messagesDeleted = botMessages.array().length;

          client.messageHandler(message, client.isInteraction, 'Deleted **' + messagesDeleted + '** bot messages')
        }).catch(err => {
          client.messageHandler(message, client.isInteraction, 'Error: ' + err);
        });

      }
      purge();
    } else {

      async function purge() {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
          return message.reply("Sorry, you don't have permission to use this.");
        }

        var deleteCount = parseInt(args[0], 10);

        if (!deleteCount || deleteCount < 0 /*|| deleteCount > 100*/) {
          return message.reply("Please provide a number between 2 and 100 for the number of messages to delete (" + parseInt(args[0], 10) + ")");
        }

        if (!client.isInteraction) {
          deleteCount = deleteCount + 1;
        }

        while (deleteCount > 99) {
          message.channel.bulkDelete(99, true)
            .catch(error => {
              return message.reply(`Error: \`\`\`\njs${error}\`\`\``);
            });
          deleteCount = deleteCount - 99;
        }

        try {
          message.channel.bulkDelete(deleteCount, true)
            .catch(error => {
              return message.reply(`Error: \`\`\`js\n${error}\`\`\``);
            });
          if (client.isInteraction) {
            message.reply("Purge command sent")
          }
        } catch (err) {
          //
        }
      }
      purge();
    }

  } catch (err) {
    message.reply(`An error occured: \`\`\`js\n${error}\`\`\``)
  }
}

exports.conf = {
  name: "Purge",
  help: "Purge a bunch of messages, of a number, from a specific user, bots, or up to 100\nThis only works on messages that're less than 2 weeks old",
  format: `k?purge [message count]
k?purge bots`,
  DM: false,
  ownerOnly: true, //fix edge cases
  alias: [],
  slashCommand: true,
  data: {
    name: "purge",
    description: "Purge messages",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'arguments',
        description: 'Arguments',
        required: true
      }
    ],
    default_permission: undefined
  }
}