const rpgdice = require('droll');
const Discord = require('discord.js');

exports.run = (client, message, args) => {
	if(args[0]){
		var numbers  = args[0].match(/\d+/g);
		if(parseInt(numbers[0]) > 120){
			return message.channel.send("One number was too high");
		} else if(numbers[1]){
			if(parseInt(numbers[1]) > 250){
				return message.channel.send("One number was too high");
			} else {
				var result = rpgdice.roll(numbers[0] + "d" +  numbers[1]);
				return message.channel.send("Result: " + result);
			}
		} else {
			if(numbers.length === 1){
				var result = rpgdice.roll("1d" + args.join(' '));
				if(!result) 
				if(result.length > 50) return message.channel.send("Too many dice");
				message.channel.send("Result: " + result);
			} else {
				var result = rpgdice.roll(args.join(' '));
				if(!result) return message.channel.send("Incorrect syntax");
				if(result.length > 50) return message.channel.send("Too many dice");
				message.channel.send("Result: " + result);
			}
		}
	} else {
		return message.channel.send("Incorrect syntax");
	}
}

exports.conf = {
	category: "Fun",
	name: "Roll/Dice",
    help: "Roll an imaginary die, can be multi-sided if you use the #d# format",
    format: "k?roll number",
    DM: true,
    OwnerOnly: false,
    alias: []
}
