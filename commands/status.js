
const Discord = require("discord.js");
const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));

exports.run = (client, message, args) => {
    if(message.author.id === "378769654942007299" || message.author.id === "365881235043516427"){
        var message2 = args.join(" ");
        data.status = message2;
        const embed = new Discord.RichEmbed()
          .setTimestamp() //Write to JSON
          .setTitle("Complete bot status changed: " + data.status)
        message.channel.send({embed});

        fs.writeFile("./JSON/data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) console.error(err)
        });

        //Log change
        client.user.setActivity(message2);
        console.log("Status changed: " + args.join(" "));
} else {
        const embed = new Discord.RichEmbed()
          .setColor(0xF46242)
          .setTimestamp() //Write to JSON
          .setTitle("You do not have permission to do this. (Bot Owner required)")
        message.channel.send({embed});
    }
}

exports.conf = {
  DM: true,
  OwnerOnly: false
}