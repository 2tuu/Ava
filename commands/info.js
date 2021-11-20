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

	var stats = [];
	Object.keys(client.commandStats).forEach(key => {stats.push(key+ ': ' + client.commandStats[key])});
	stats = stats.join('\n');


	const embed = new Discord.MessageEmbed()
	.setTitle("")
	.setAuthor(client.user.username, client.user.avatarURL)

	.setDescription(
		"**Stats: **" + `${k}` + "\n" + 
		"**Guilds/Users: **" + `${client.guilds.cache.size}/${client.users.cache.size}` + "\n" +
		"**Stats:**\n" + stats
	)

	.setFooter('v.' + `${client.version} ${client.codename}` + ' (current repo version: ' + client.currentVersion + ')')

	message.channel.send({embed})

}
	fetchUser();
 }
 
 exports.conf = {
	category: "Admin",
	name: "N/A (dev command)",
    help: "View my version information, the artist for my avatar, and other statistics",
    format: "k?info",
    DM: true,
    OwnerOnly: true,
    alias: ['stats']
}
