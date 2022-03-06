exports.run = (client, message, args) => {

    function stringToBinary(str, spaceSeparatedOctets) {
        function zeroPad(num) {
            return "00000000".slice(String(num).length) + num;
        }

        return str.replace(/[\s\S]/g, function (str) {
            str = zeroPad(str.charCodeAt().toString(2));
            return !1 == spaceSeparatedOctets ? str : str + " "
        });
    };

    var text = args.slice(1).join(' ');
    var type = args[0];

    var types = ['tob64', 'fromb64', 'tobinary', 'frombinary']; //String type list

    if (!type || type.length < 1 || !types.includes(type)) return client.messageHandler(message, client.isInteraction, 'Invalid type, use `' + types.join(', ') + '`');
    if (!text || text.length < 1) return client.messageHandler(message, client.isInteraction, 'No text was given to translate');

    if (type === "tob64") {
        result = Buffer.from(text).toString('base64');
    } else if (type === "fromb64") {
        result = Buffer.from(text, 'base64').toString('ascii');
    } else if (type === "tobinary") {
        result = stringToBinary(text);
    } else if (type === "frombinary") {
        result = parseInt(text, 2).toString(10);
    }

    if (!result || result.length < 1) return client.messageHandler(message, client.isInteraction, 'Invalid response, make sure your code is correct');

    client.messageHandler(message, client.isInteraction, `Result: \`${result}\``);

}

exports.conf = {
    name: "Translate",
    help: "Translate anything to or from base64 or binary",
    format: "k?translate [fromb64/frombinary/tob64/tobinary] [text to be translated]",
    DM: true,
    ownerOnly: false,
    alias: [],
    slashCommand: true,
    data: {
        name: 'translate',
        description: 'Translates to or from Base64 and Binary',
        options: [
            {
                choices: [
                    { name: 'to base64', value: 'tob64' },
                    { name: 'from base64', value: 'fromb64' },
                    { name: 'to binary', value: 'tobinary' },
                    { name: 'from binary', value: 'frombinary' }
                ],
                autocomplete: undefined,
                type: 3,
                name: 'translate',
                description: 'How to translate the text',
                required: true
            },
            {
                choices: undefined,
                autocomplete: undefined,
                type: 3,
                name: 'text',
                description: 'The text you want to translate',
                required: true
            }
        ],
        default_permission: undefined
    }
}