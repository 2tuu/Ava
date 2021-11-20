const config = require(`./../config.json`);

exports.run = (client, message, args) => {
async function evalCMD(){

    function clean(text) {
      if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
      return text;
    }

    if(config.evalAllow.includes(message.author.id)){

      try {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);

          var res = clean(evaled);
              res = res.replace(new RegExp(config.token_prod, 'g'), '[TOKEN]');
              res = res.replace(new RegExp(config.token_beta, 'g'), '[TOKEN]');

              res = res.replace(new RegExp(config.dbpass, 'g'), '[REDACTED]');
              res = res.replace(new RegExp(config.e6apikey, 'g'), '[REDACTED]');
              res = res.replace(new RegExp(config.kitk_token, 'g'), '[REDACTED]');
              res = res.replace(new RegExp(config.youtube, 'g'), '[REDACTED]');
              res = res.replace(new RegExp(config.imgur, 'g'), '[REDACTED]');

        message.channel.send(res, {code:"xl"});
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }

    } else {
      const embed = new Discord.MessageEmbed()
        .setColor(0xF46242)
        .setTimestamp()
        .setTitle("You do not have permission to do this. (Bot Owner required)")
      message.channel.send({embed});
    }
  }

  evalCMD();
}

exports.conf = {
  category: "Admin",
  name: "N/A (dev command)",
  help: "You can't use this",
  format: "N/A",
  DM: true,
  OwnerOnly: true,
  alias: []
}