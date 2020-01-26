exports.run = async (client, message, args) => {

    m = await message.channel.send("Ping?");
    m.edit(`Pong \`${Math.floor((m.createdTimestamp - message.createdTimestamp) - client.ping)}ms\``);

}

exports.conf = {
    DM: true,
    OwnerOnly: false
}