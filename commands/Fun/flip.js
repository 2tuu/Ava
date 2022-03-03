exports.run = (client, message, args) => {
    var rand = Math.floor(Math.random() * 2);
    if (rand == 1) {
        var response = "Tails"
    } else {
        var response = "Heads"
    }
    client.messageHandler(message, client.isInteraction, `You got ${response}`);
}

exports.conf = {
    name: "Flip",
    help: "Flip an imaginary coin",
    format: "k?flip",
    DM: true,
    ownerOnly: false,
    alias: ['coin'],
    slashCommand: true,
    data: {
        name: "flip",
        description: "Flip a coin",
        options: [],
        default_permission: undefined
    }
}