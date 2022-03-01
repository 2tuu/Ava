exports.run = async (client, message, args) => {
    m = await client.messageHandler(message, client.isInteraction, "Ping?");
    m.edit(`Pong \`${Math.floor((m.createdTimestamp - message.createdTimestamp) - client.ws.ping)}ms\``);
}

exports.conf = {
    category: "Utility",
    name: "Ping",
    help: "Ping me and gauge my response time (-API response times)",
    shortHelp: "Pong",
    format: "k?ping",
    DM: true,
    ownerOnly: false,
    alias: ['pong'],
    slashCommand: false
}