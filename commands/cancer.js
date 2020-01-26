exports.run = (client, message, args) => {
    function reverseString(str) {
        str = str.toLowerCase();
        var splitString = str.split("");

        var i = 0;

        splitString.forEach(e => {
            var rand = Math.floor(Math.random() * 2);

            if(rand === 1){
                splitString[i] = splitString[i].toUpperCase();
            }

            i = i + 1;
        });

        return splitString.join("");
    }


    if (!args[0]) {
        message.channel.send("Field is blank");
    } else {
        message.channel.send(reverseString(args.join(' ')));
    }

}

exports.conf = {
    DM: true,
    OwnerOnly: false,
    alias: []
}