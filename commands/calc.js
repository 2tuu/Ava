var math = require('mathjs');
exports.run = (client, message, args) => {

    var res  = math.evaluate(args.join(' '));
    message.channel.send(`Result: \`${res}\``)

}

exports.conf = {
    category: "Utility",
    name: "Calculator",
    help: "It's a calculator",
    format: "k?calc [mathematical function]",
    DM: true,
    OwnerOnly: true,
    alias: []
}