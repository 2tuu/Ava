exports.run = (client, message, args) => {
    
        message.channel.send("**" + message.author.username + "** has paid their respects.");

}

exports.conf = {
    help: "Pay your respects",
    format: "k?f",
    DM: false,
    OwnerOnly: false,
    alias: []
}