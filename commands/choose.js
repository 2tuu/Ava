exports.run = (client, message, args) => {
    if(!args[1]) return client.messageHandler(message, client.isInteraction, "You didn't give me enough things to choose");
    var response = args[Math.floor(Math.random()*args.length)];
    response = response.replace("\"", "");
    response = response.replace("\"", "");
    
    client.messageHandler(message, client.isInteraction, "I choose **" + response + "**")
}

exports.conf = {
    category: "Fun",
    name: "Choose",
    help: "Choose between multiple things",
    shortHelp: "Make me choose something",
    format: "k?choose [thing1] [thing2] {thing3}...\nUse quotation marks for things with multiple words",
    DM: true,
    ownerOnly: false,
    alias: [],
  slashCommand: true
}