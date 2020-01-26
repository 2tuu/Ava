
exports.run = (client, message, args) => {
if(!message.guild){
    const embed = new Discord.RichEmbed()
    .setColor(0xF46242)
    .setTimestamp() //Write to JSON
    .setTitle("This command is disabled in DMs")
    message.channel.send({embed});
} else {
if(!args[0]){
       return;
} else {
    var blacklist = ['239457287704412160', 'ID2'];
    var serverBlacklist = ['110373943822540800'];

    if(!args[0]) return;
    if(!blacklist.includes(message.author.id) && !serverBlacklist.includes(message.guild.id)){
    // get client from message's channel
	let clientVar = message.channel.client;

	// fetch user via given user id
	let user = clientVar.fetchUser('378769654942007299')
	    .then(user => {
            
        const embed1 = new Discord.RichEmbed()
                    .setTitle("Profile Reported:")
                    .setThumbnail(message.author.avatarURL)
					.addField("From", message.author.id + " (" + message.author.username + "#" + message.author.discriminator + ")")
                    .addField("Sent in", message.guild.name + " (" + message.guild.id + ")")
                    .addField("Report", args.join(' '))
                    .setTimestamp()
					.setFooter("Profile reported")
                    user.send({embed: embed1}).then().catch(console.error);
                    

        
        let embedVar = new Discord.RichEmbed()
        .setColor(0xF46242)
        .setTimestamp() //Write to JSON
        .setTitle("Profile Reported")
        .setFooter("Misuse of this command will result in addition to the blacklist")
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
}
}

exports.conf = {
    DM: true,
    OwnerOnly: false
}