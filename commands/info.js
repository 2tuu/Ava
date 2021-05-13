const Discord = require("discord.js");
const data = require('./../JSON/data.json');
/*
const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));
*/

exports.run = (client, message) => {

	async function fetchUser(id){

	var k = await client.users.fetch('378769654942007299');

	k = k.username + "#" + k.discriminator;


	const embed = new Discord.MessageEmbed()
	.setTitle("")
	.setAuthor(client.user.username, client.user.avatarURL)

	.setDescription(
		"**Author: **" + `${k}` + "\n" + 
		"**Guilds/Users: **" + `${client.guilds.cache.size}/${client.users.cache.size}` + "\n" +
		"**Icon Source: ** " + data.icon_artist + " ([Link](" + data.icon_link + "))" + "\n" +
		"**Github:** " + "[Link](https://github.com/2tuu/Kit)"
	)

	.setFooter('v.' + client.version + ' (current online: ' + client.currentVersion + ')')

	message.channel.send({embed})

}
	fetchUser();
 }
 
 exports.conf = {
    help: "View my version information, the artist for my avatar, and other statistics",
    format: "k?info",
    DM: true,
    OwnerOnly: false,
    alias: ['stats']
}
