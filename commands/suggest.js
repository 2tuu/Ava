const Discord = require("discord.js");
const config = require('./../config.json');

exports.run = (client, message, args) => {

    if(!args[0]) return;
    // get client from message's channel
	let clientVar = message.channel.client;

	// fetch user via given user id
	let user = clientVar.fetchUser(config.owner)
	    .then(user => {
            var letterAR = ["A", "B", "C", "D"];
            var rand = letterAR[Math.floor(Math.random() * letterAR.length)];

            var errID = `${rand}-${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}-1`;

        const embed1 = new Discord.RichEmbed()
                    .setTitle("SUGGESTION ID: " + errID)
                    .setThumbnail(message.author.avatarURL)
					.addField("From", message.author.id + " (" + message.author.username + "#" + message.author.discriminator + ")")
                    .addField("Sent in", message.guild.name + " (" + message.guild.id + ")")
                    .addField("Report", args.join(' '))
                    .setTimestamp()
					.setFooter("Error reported")
                    user.send({embed: embed1}).then().catch(console.error);
                    

                    var chan = client.channels.get(config.suggestions);

                    const embed2 = new Discord.RichEmbed()
                    .setTitle("Suggestion ID: " + errID)
                    .addField("Content", args.join(' '))
                    .setTimestamp()
					.setFooter("Suggestion recieved")
                    chan.send({embed: embed2}).then().catch(console.error);
        
        let embedVar = new Discord.RichEmbed()
        .setColor(0xF46242)
        .setTimestamp() //Write to JSON
        .setTitle("Suggestion sent")
        message.channel.send({embed: embedVar});
        
        }).then().catch(console.error);

}


exports.conf = {
    help: "Make a suggestion to the bot",
    format: "k?suggest [suggestion]",
    DM: false,
    OwnerOnly: false,
    alias: []
}