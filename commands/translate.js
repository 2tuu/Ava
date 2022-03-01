exports.run = (client, message, args) => {

    function stringToBinary(str, spaceSeparatedOctets) {
        function zeroPad(num) {
            return "00000000".slice(String(num).length) + num;
        }
    
        return str.replace(/[\s\S]/g, function(str) {
            str = zeroPad(str.charCodeAt().toString(2));
            return !1 == spaceSeparatedOctets ? str : str + " "
        });
    };

    var text = args.slice(1).join(' ');
    var type = args[0];

    var types = ['tob64', 'fromb64', 'tobinary', 'frombinary']; //String type list

    if(!type || type.length < 1 || !types.includes(type)) return client.messageHandler(message, client.isInteraction, 'Invalid type, use `' + types.join(', ') + '`');
    if(!text || text.length < 1) return client.messageHandler(message, client.isInteraction, 'No text was given to translate');

    if(type === "tob64"){
        result = Buffer.from(text).toString('base64');
    } else if(type === "fromb64"){
        result = Buffer.from(text, 'base64').toString('ascii');
    } else if(type === "tobinary"){
        result = stringToBinary(text);
    } else if(type === "frombinary"){
        result = parseInt(text,2).toString(10);
    }

    if(!result || result.length < 1) return client.messageHandler(message, client.isInteraction, 'Invalid response, make sure your code is correct');

    client.messageHandler(message, client.isInteraction, `Result: \`${result}\``);

}

exports.conf = {
    category: "Fun",
    name: "Translate",
    help: "Translate anything to or from base64 or binary",
    shortHelp: "Base64/Binary converter",
    format: "k?translate [fromb64/frombinary/tob64/tobinary] [text to be translated]",
    DM: true,
    ownerOnly: false,
    alias: [],
  slashCommand: true
}