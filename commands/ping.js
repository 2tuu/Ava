exports.run = async (client, message, args) => {

    m = await message.channel.send("Ping?");
    m.edit(`Pong \`${Math.floor((m.createdTimestamp - message.createdTimestamp) - client.ws.ping)}ms\``);

}

exports.conf = {
    help: "Ping me and gauge my response time (-API response times)",
    format: "k?ping",
    DM: true,
    OwnerOnly: false,
    alias: ['pong']
}