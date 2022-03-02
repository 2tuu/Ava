var math = require('mathjs');
exports.run = (client, message, args) => {

    try{
        var res  = math.evaluate(args.join(' '));
        client.messageHandler(message, client.isInteraction, `Result: \`${res}\``)
    } catch (err) {
        client.messageHandler(message, client.isInteraction, `Error: Please check your math`)
    }

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
   slashCommand: true,
   data: {
    name: "calc",
    description: "Calculatorr",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'math',
        description: 'Math goes here',
        required: true
      }
    ],
    default_permission: undefined
  }
}