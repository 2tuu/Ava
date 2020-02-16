
exports.run = (client, message, args) => {
    message.channel.send(message.author.id);
}

exports.conf = {
    help: "Show your user ID, for anyone who doesn't have developer mode on",
    format: "k?myid",
    DM: true,
    OwnerOnly: false,
    alias: ["id", "whatismyid"]
}