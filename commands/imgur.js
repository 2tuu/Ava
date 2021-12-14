
const Discord = require("discord.js");
const axios = require('axios');
var fs = require('fs');



const config = require('./../config.json')

exports.run = (client, message, args) => {

    var Attachment = (message.attachments).array();

	const embed = new Discord.MessageEmbed()
	.setColor(`0x${client.colors.bad}`)
	.setDescription(JSON.stringify(Attachment[0]) + '\n' + `Client-ID ${config.imgur}`)
	message.channel.send({embed});

	if(!Attachment[0]){
		const embed = new Discord.MessageEmbed()
			.setColor(`0x${client.colors.bad}`)
			.setDescription("Error: No/too many attachments")
		return message.channel.send({embed});
	} else if(Attachment[1]){
		const embed = new Discord.MessageEmbed()
			.setColor(`0x${client.colors.bad}`)
			.setDescription("Error: No/too many attachments")
		return message.channel.send({embed});
	}

	message.channel.startTyping();

		if(message.author.bot === false ){
		var Attachment = (message.attachments).array();
		axios.post('https://api.imgur.com/3/upload', {
			Authorization: `Client-ID ${config.imgur}`,
			image: Attachment[0]
		  }).then((result) => {
		console.log(result);	  
		}).catch((err)=>{
			const embed = new Discord.MessageEmbed()
				.setColor(`0x${client.colors.bad}`)
				.setDescription("```js\n" + err.stack + "\n```")
            return message.channel.send({embed});
		})}

    message.channel.stopTyping();
}

exports.conf = {
	category: "In Development",
	name: "Imgur",
    help: "Generate an imgur link for the attached image, or a linked image",
    format: "k?imur {link}\n- if link is not provided, an image n=must be attached",
    DM: true,
    OwnerOnly: true, //disabled until fixed
    alias: []
}