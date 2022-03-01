var math = require('mathjs');
exports.run = (client, message, args) => {

    var res  = math.evaluate(args.join(' '));
    client.messageHandler(message, client.isInteraction, `Result: \`${res}\``)

}

//needs testing
exports.conf = {
    category: "Utility",
    name: "Calculator",
    help: "It's a calculator",
    shortHelp: "Calculator",
    format: "k?calc [mathematical function]",
    DM: true,
    ownerOnly: false,
    alias: [],
   slashCommand: true
}