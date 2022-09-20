exports.run = (client, message, args, deletedMessage, pool, tossedSet, roles, messageContent) => {
    function mock(str) {
        str = str.toLowerCase();
        var splitString = str.split("");

        var i = 0;

        splitString.forEach(e => {
            var rand = Math.round(Math.random() * 1);

            if(rand === 1){
                splitString[i] = splitString[i].toUpperCase();
            }

            i = i + 1;
        });

        return splitString.join("");
    }


    if (!args[0]) {
        message.reply("I need text to translate");
    } else {
        client.messageHandler(message, client.isInteraction, mock(messageContent));
    }

}

exports.conf = {
    help: "Randomly capitalize letters in a given sentance",
    format: "k?mock [text]",
    DM: false,
    OwnerOnly: false,
    alias: ['spongebob']
}