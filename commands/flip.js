exports.run = (client, message, args) => {

    var rand = Math.floor(Math.random() * 2);
    if(rand = 1){
        var response = "Tails"
    } else {
        var response = "Heads"
    }

    message.channel.send(`You got ${response}`);
}
    
exports.conf = {
    help: "Flip a non-existant coin",
    format: "k?flip",
    DM: true,
    OwnerOnly: false,
    alias: ['coin']
}