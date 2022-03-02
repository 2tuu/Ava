const rpgdice = require('droll');
const Discord = require('discord.js');

exports.run = (client, message, args) => {
	if(args[0]){
		var numbers  = args[0].match(/\d+/g);
		if(parseInt(numbers[0]) > 120){
			return client.messageHandler(message, client.isInteraction, "One number was too high");
		} else if(numbers[1]){
			if(parseInt(numbers[1]) > 250){
				return client.messageHandler(message, client.isInteraction, "One number was too high");
			} else {
				var result = rpgdice.roll(numbers[0] + "d" +  numbers[1]);
				return client.messageHandler(message, client.isInteraction, "Result: " + result);
			}
		} else {
			if(numbers.length === 1){
				var result = rpgdice.roll("1d" + args.join(' '));
				if(!result) 
				if(result.length > 50) return client.messageHandler(message, client.isInteraction, "Too many dice");
				client.messageHandler(message, client.isInteraction, "Result: " + result);
			} else {
				var result = rpgdice.roll(args.join(' '));
				if(!result) return client.messageHandler(message, client.isInteraction, "Incorrect syntax");
				if(result.length > 50) return client.messageHandler(message, client.isInteraction, "Too many dice");
				client.messageHandler(message, client.isInteraction, "Result: " + result);
			}
		}
	} else {
		return client.messageHandler(message, client.isInteraction, "Incorrect syntax");
	}
}

exports.conf = {
	category: "Fun",
	name: "Roll/Dice",
	shortHelp: "Roll RPG dice",
    help: "Roll an imaginary die, can be multi-sided if you use the #d# format",
    format: "k?roll number",
    DM: true,
    ownerOnly: false,
    alias: [],
  slashCommand: true,
  data: {
    name: "roll",
    description: "Roll a virtual RPG die",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'dice',
        description: 'ie. 1d20',
        required: true
      }
    ],
    default_permission: undefined
  }
}
