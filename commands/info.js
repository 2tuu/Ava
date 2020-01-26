const Discord = require("discord.js");
const data = require('./../JSON/data.json');
/*
const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));
*/

exports.run = (client, message) => {

	async function fetchUser(id){

	var k = await client.users.get('378769654942007299');
	var s = await client.users.get('454461184792461312');

	k = k.username + "#" + k.discriminator;
	s = s.username + "#" + s.discriminator;

	

	const embed = new Discord.RichEmbed()
	.setTitle("")
	.setAuthor(client.user.username, client.user.avatarURL)
	//.setDescription("Icon by Gats")
	//.setThumbnail(client.user.avatarURL)

	.setDescription(
		"**Authors: **" + `${k}, ${s}` + "\n" + 
		"**Guilds/Users: **" + `${client.guilds.size}/${client.users.size}` + "\n" +
		"**Icon Source: ** " + data.icon_artist + " ([Link](" + data.icon_link + "))" + "\n" +
		"**Website:** " + "[Link](https://kit-bot.2tu.dev/)"
	)

	.setFooter("v." + data.version)

	message.channel.send({embed})

}
	fetchUser();
 }
 
 exports.conf = {
    DM: true,
    OwnerOnly: false,
    alias: ['stats']
}
