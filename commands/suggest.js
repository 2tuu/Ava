const Discord = require("discord.js");
const config = require('./../config.json');

const reportedRecently = new Set();

exports.run = (client, message, args) => {

    if (reportedRecently.has(message.author.id)) {
        let embedVar = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setTitle("Please wait at least 4 hours before submitting another suggestion")
        return message.channel.send({embed: embedVar});
      } else {
        reportedRecently.add(message.author.id);
        setTimeout(() => {
        reportedRecently.delete(message.author.id);
        }, 14400000);
      }

    if(!args[0]) return;
    // get client from message's channel
	let clientVar = message.channel.client;

	// fetch user via given user id
	let user = client.users.fetch(config.owner)
	    .then(user => {
            const embed1 = new Discord.MessageEmbed()
                .setTitle("Suggestion")
                .setColor(`0x${client.colors.good}`)
                .setThumbnail(message.author.avatarURL)
                .addField("From", message.author.id + " (" + message.author.username + "#" + message.author.discriminator + ")")
                .addField("Sent in", message.guild.name + " (" + message.guild.id + ")")
                .addField("Suggestion", args.join(' '))
                .setTimestamp()
                .setFooter("Suggestion Submitted")
                user.send({embed: embed1}).then().catch(console.error);
                

                var chan = client.channels.cache.get(config.suggestions);

                const embed2 = new Discord.MessageEmbed()
                .setTitle("Suggestion Recieved")
                .setThumbnail(message.author.avatarURL)
                .addField("From", message.author.username)
                .addField("Suggestion", args.join(' '))
                .setTimestamp()
                .setFooter("Suggestion Submitted")
                chan.send({embed: embed2}).then().catch(console.error);
        
        let embedVar = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.good}`)
        .setTitle("You suggestion has been submitted")
        message.channel.send({embed: embedVar});
        
        }).then().catch(console.error);

}

exports.conf = {
    category: "Utility",
    name: "N/A (dev command)",
    help: "Suggest a feature or change that you'd like to see",
    format: "k?suggest [description]",
    DM: false,
    OwnerOnly: true,
    alias: []
}