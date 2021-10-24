exports.run = (client, message, args) => {
    function reverseString(str) {
	    var splitString = str.split("");
	    var reverseArray = splitString.reverse();
	    var joinArray = reverseArray.join("");
	    return joinArray;
    }

    
if(!args[0]){
	message.channel.send("Field is blank");
} else {
	message.channel.send(reverseString(args.join(' ')));
	  }
    
}

exports.conf = {
    name: "Reverse",
    help: "Reverse the given text",
    format: "k?reverse [text]",
    DM: true,
    OwnerOnly: false,
    alias: []
}