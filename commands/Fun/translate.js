const Discord = require("discord.js");

exports.run = (client, message, args) => {
    if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['translate'].help)
			.addField("Usage", '```' + client.help['translate'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

    function stringToBinary(str, oct) {
        function pad(num) {
            return "00000000".slice(String(num).length) + num;
        }

        return str.replace(/[\s\S]/g, function (str) {
            str = pad(str.charCodeAt().toString(2));
            return !1 == oct ? str : str + " "
        });
    };

    function stringFromBinary(str){
        var bin = [];
        for (i = 0; i < str.split(" ").length; i++) {
            bin.push(String.fromCharCode(parseInt(str.split(" ")[i], 2)));
          }
        return bin.join("");
    }

    var text = args.slice(1).join(' ');
    var type = args[0];

    var types = ['tob64', 'fromb64', 'tobinary', 'frombinary']; //String type list

    if (!type || type.length < 1 || !types.includes(type)) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Invalid type, use `' + types.join(', ') + '`')
            .setColor(`0x${client.colors.bad}`)
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }
    if (!text || text.length < 1) {
        const embed = new Discord.MessageEmbed()
            .setTitle("No text was given to translate")
            .setColor(`0x${client.colors.bad}`)
        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

    if (type === "tob64") {
        result = Buffer.from(text).toString('base64');
    } else if (type === "fromb64") {
        result = Buffer.from(text, 'base64').toString('ascii');
    } else if (type === "tobinary") {
        result = stringToBinary(text);
    } else if (type === "frombinary") {
        result = stringFromBinary(text)
    }

    if (!result || result.length < 1) {
        const embed = new Discord.MessageEmbed()
            .setTitle("An error occured")
            .setColor(`0x${client.colors.bad}`)
        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

    client.messageHandler(message, client.isInteraction, `Result: \`${result.replaceAll('`','')}\``);

}

exports.conf = {
    name: "Translate",
    help: "Translate anything to or from base64 or binary",
    format: "k?translate [fromb64/frombinary/tob64/tobinary] [text to be translated]\nie. k?translate fromb64 d29yZA==",
    DM: false,
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
        dm_permission: false
    }
}