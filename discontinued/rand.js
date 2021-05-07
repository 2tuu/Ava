exports.run = (client, message, args) => {

    if(!args[0] || isNaN(args[0]) ){
        message.channel.send("Please provide at least 1 number");
    } else if(!args[1]){ //if only 1 number
        var resp = Math.floor(Math.random() * args[0]) + 1;
        message.channel.send("Result: " + resp);
    } else { //if 2 numbers

        if(isNaN(args[1])){
            return message.channel.send("Please provide at least 1 number");
        }

        var max = parseInt(args[1]);
        var min = parseInt(args[0]);
        var resp = Math.floor(Math.random() * (max - min + 1) + min);

        message.channel.send("Result: " + resp).catch((err) => {
            message.channel.send("An Error Occured: " + err)
            console.error(err);
        });
    }
}

exports.conf = {
    help: "Generate a random number, between 2 numbers or above 0",
    format: "k?rand [#] {optional: #}",
    DM: true,
    OwnerOnly: false,
    alias: []
}