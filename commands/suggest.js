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
            var letterAR = ["E", "F", "G", ""];
            var rand = letterAR[Math.floor(Math.random() * letterAR.length)];

            var errID = `${rand}-${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}-1`;
                    

                    var chan = client.channels.find('id', '495366458877018112');

                    const embed2 = new Discord.RichEmbed()
                    .setTitle("Suggestion ID: " + errID)
                    .setThumbnail(message.author.avatarURL)
					.addField("From", message.author.id + " (" + message.author.username + "#" + message.author.discriminator + ")")
                    //.addField("Sent in", message.guild.name + " (" + message.guild.id + ")")
                    .addField("Message", args.join(' '))
                    .setTimestamp()
					.setFooter("Suggestion Report")
                    chan.send({embed: embed2}).then().catch(console.error);;
        
        let embedVar = new Discord.RichEmbed()
        .setColor(0xF46242)
        .setTimestamp() //Write to JSON
        .setTitle("Suggestion sent.")
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