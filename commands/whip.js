const Discord = require('discord.js');
const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));

var lossNum = 7;

exports.run = (client, message, args) => {
    var response = Math.floor(Math.random()*lossNum); 
	const embed = new Discord.RichEmbed()
       .setImage("https://kitk.us/bot/whip/" + response + ".jpg")
       .setTimestamp()
       .setFooter("Powered by KitK.us | " + response)
	   message.channel.send({embed}); //NAMING SCHEME - /loss/#.jpg <- MUST BE JPG
	console.log('LS: ' + response + `.jpg`);
}

exports.conf = {
    DM: true,
    OwnerOnly: false
}