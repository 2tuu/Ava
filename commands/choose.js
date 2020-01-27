exports.run = (client, message, args) => {

		if(!args[1]) return message.channel.send("You didn't give me enough things to choose");
		var response = args[Math.floor(Math.random()*args.length)];
		response = response.replace("\"", "");
		response = response.replace("\"", "");
		
		message.channel.send("I choose **" + response + "**");
    
}

exports.conf = {
    help: "Choose between multiple things",
    format: "k?choose [thing1] [thing2] {thing3}...\nUse quotation marks for things with multiple words",
    DM: true,
    OwnerOnly: false,
    alias: []
}