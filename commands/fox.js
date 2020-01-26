const Discord = require("discord.js");
const fs = require('fs');

let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));
var foxNum = data.foxNum;

//Random fox
exports.run = (client, message, args) => {
    var response = Math.floor(Math.random()*foxNum); 
    let embedVar = new Discord.RichEmbed()
       .setImage("https://kitk.us/bot/fox/" + response + ".jpg")
       .setTimestamp()
       .setFooter("Powered by KitK.us")
       message.channel.send({embed: embedVar}); //NAMING SCHEME - /loss/#.jpg <- MUST BE JPG
    console.log('FX: ' + response + `.jpg`);
}

exports.conf = {
    DM: true,
    OwnerOnly: false
}