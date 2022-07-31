const config = require(`./../../config.json`);
const Discord = require(`discord.js`);
const fs = require(`fs`);

exports.run = (client, message, args, deletedMessage, sql) => {
  async function evalCMD() {

    function clean(text) {
      if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
        return text;
    }

    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      var res = clean(evaled);
      var filter = [config.token_prod, config.token_beta, config.dbpass, config.dbuser, config.kitk_token, config.youtube];

      filter.forEach(e => {
        res = res.replace(new RegExp(e, 'g'), '[REMOVED]');
      })

      if (`\`\`\`\n${res}\n\`\`\``.length > 2000) {
        var buf = Buffer.from(res, 'utf8');

        const embed = new Discord.MessageEmbed()
          .setColor(`0x${client.colors.bad}`)
          .setDescription("```diff\n-Output too long:\n```")
        message.channel.send({ embeds: [embed] });
        message.channel.send({
          files: [
            {
              attachment: buf,
              name: 'log.txt'
            }
          ]
        });
      } else {
        client.messageHandler(message, client.isInteraction, `\`\`\`\n${res}\n\`\`\``);
      }
    } catch (err) {
      client.messageHandler(message, client.isInteraction, `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }


  }

  evalCMD();
}

exports.conf = {
  name: "N/A (dev command)",
  help: "You can't use this",
  format: "N/A",
  DM: true,
  ownerOnly: true,
  alias: []
}