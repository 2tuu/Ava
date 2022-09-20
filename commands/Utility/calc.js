var math = require('mathjs');
const Discord = require("discord.js");

exports.run = (client, message, args) => {

    if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['calc'].help)
			.addField("Usage", '```' + client.help['calc'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

    try {
        var res = math.evaluate(args.join(' '));
        client.messageHandler(message, client.isInteraction, `Result: \`${res}\``)
    } catch (err) {
        client.messageHandler(message, client.isInteraction, `Error: Please check your math`)
    }

}

//needs testing
exports.conf = {
    name: "Calculator",
    help: "It's a calculator",
    format: "k?calc [math]",
    DM: true,
    ownerOnly: false,
    alias: [],
    slashCommand: true,
    data: {
        name: "calc",
        description: "Calculator",
        options: [
            {
                choices: undefined,
                autocomplete: undefined,
                type: 3,
                name: 'math',
                description: 'Math goes here',
                required: true
            }
        ],
        dm_permission: true
    }
}