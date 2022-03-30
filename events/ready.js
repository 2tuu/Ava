const fs = require('fs');
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const axios = require('axios');
const cron = require('node-cron');

exports.run = async (deletedMessage, pool, client) => {
	var current = 0
	current = await axios.get('https://raw.githubusercontent.com/2tuu/Kit/master/plugins/data.json');
	current = current.data.version;

	client.currentVersion = current;

	let version = require("./../plugins/data.json");
	client.version = version.version;
	client.codename = version.codename;

	console.log(`Loaded ${client.totalCommands} modules - ${client.failedCommands.length} failed`);
	console.log("============================");
	if ((current > client.version) && parseInt(client.version) !== 0) {
		console.error('Your framework is out of date - To update, either download and overwrite the contents of my folder, or run \'node update\' in this folder');
		console.error(`The current Github version is: ` + current + '\n');
		console.error(`Your version is: ` + client.version + '\n');
		console.error('\n To disable this notice, set your version number in /plugins/data.json to 0');
		console.log("============================");
	} else if (client.version == '0') {
		//disable version report
	} else {
		console.log(`Version: ` + client.version + ' - ' + client.codename);
	}
	console.log(`${client.channels.cache.size} channels - ${client.guilds.cache.size} guilds`);
	console.log("=============log============");

	client.emojiPile = client.emojis.cache.toJSON().map(e=>e).map(e=>e.id)
	console.log('Loaded emoji cache')
	//client.user.setStatus('dnd');

	const logChannel = client.channels.resolve(config.logChannel);
	logChannel.send(`\`\`\`js
	Log-in Success:
	Version: ${client.version}

	User Cache: ${client.users.cache.size}
	Server Count: ${client.guilds.cache.size}
	\`\`\``)
	if (client.failedCommands.length > 0) {
		logChannel.send(`\`\`\`js
		ERROR LOADING COMMANDS: ${client.failedCommands}
		\`\`\``)
	}

	cron.schedule("*/30 * * * * *", async function () {

		var currenttime = Date.now();
		var remind = await pool.query(`SELECT * FROM timer`);
		remind = remind.rows;

		remind.forEach(e => {
			var status = '';
			if (e.endtime < currenttime) {

				if (currenttime - e.endtime > 300000) {
					status = ' (delayed)';
				}

				client.channels.fetch(e.channelcreated)
					.then(channel => {
						channel.send(`<@${e.user}>, earlier you reminded me to tell you \`${e.message.replace(/[`]/g, '')}\`` + status);
						pool.query(`DELETE FROM timer WHERE "endtime" ='${e.endtime}'`);
					})
					.catch(console.error);
			}
		});

	});

	client.logChannel = client.channels.resolve(config.logChannel);

}
