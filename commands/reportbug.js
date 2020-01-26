const Discord = require("discord.js");

exports.run = (client, message, args) => {

    var blacklist = [];
    var serverBlacklist = [];

    if(!args[0]) return;
    if(!blacklist.includes(message.author.id) && !serverBlacklist.includes(message.guild.id)){
    // get client from message's channel
	let clientVar = message.channel.client;

	// fetch user via given user id
	let user = clientVar.fetchUser('378769654942007299')
	    .then(user => {
            var letterAR = ["A", "B", "C", "D"];
            var rand = letterAR[Math.floor(Math.random() * letterAR.length)];

            var errID = `${rand}-${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}-1`;

        const embed1 = new Discord.RichEmbed()
                    .setTitle("Error ID: " + errID)
                    .setThumbnail(message.author.avatarURL)
					.addField("From", message.author.id + " (" + message.author.username + "#" + message.author.discriminator + ")")
                    .addField("Sent in", message.guild.name + " (" + message.guild.id + ")")
                    .addField("Report", args.join(' '))
                    .setTimestamp()
					.setFooter("Error reported")
                    user.send({embed: embed1}).then().catch(console.error);
                    

                    var chan = client.channels.find('id', '473273549390610442');

                    const embed2 = new Discord.RichEmbed()
                    .setTitle("Error ID: " + errID)
                    .setThumbnail(message.author.avatarURL)
					.addField("From", message.author.id + " (" + message.author.username + "#" + message.author.discriminator + ")")
                    .addField("Sent in", message.guild.name + " (" + message.guild.id + ")")
                    .addField("Report", args.join(' '))
                    .setTimestamp()
					.setFooter("Error reported")
                    chan.send({embed: embed2}).then().catch(console.error);
        
        let embedVar = new Discord.RichEmbed()
        .setColor(0xF46242)
        .setTimestamp() //Write to JSON
        .setTitle("Error has been reported, make sure to enable DMs on this server so that a follow-up message can be sent.")
        message.channel.send({embed: embedVar});
        
        }).then().catch(console.error);

    } else {
        let embedVar = new Discord.RichEmbed()
        .setColor(0xF46242)
        .setTimestamp() //Write to JSON
        .setTitle("Action can't be completed, your user ID or guild ID is on the blacklist, the bot will still function normally, but this function will be disabled.")
        message.channel.send({embed: embedVar});
    }
}

exports.conf = {
    DM: true,
    OwnerOnly: false
}