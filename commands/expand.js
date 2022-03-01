const AFHConvert = require('ascii-fullwidth-halfwidth-convert');
const converter = new AFHConvert();

exports.run = (client, message, args) => {
    if(!args[0]){
        client.messageHandler(message, client.isInteraction, "Field is blank");
    }else if(args[0].toLowerCase() === "dong" && !args[1]){
        client.messageHandler(message, client.isInteraction, "https://i.imgur.com/65ldTm4.png");
    } else {
        var messageStr = args.join(' ');
        client.messageHandler(message, client.isInteraction, converter.toFullWidth(messageStr));
    }
}

exports.conf = {
    category: "Fun",
    name: "Expand",
    help: "Convert the text to fullwidth font",
    shortHelp: "Fullwidth font converter",
    format: "k?expand [text]",
    DM: true,
    ownerOnly: false,
    alias: ['vapor', 'vapour'], //innit
  slashCommand: true
}