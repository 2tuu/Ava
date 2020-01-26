exports.run = (client, message, args) => {
    
    if(message.guild.id === ""){
        return;
    } else {
        message.channel.send("**" + message.author.username + "** has paid their respects.");
    }
}

exports.conf = {
    DM: true,
    OwnerOnly: false
}