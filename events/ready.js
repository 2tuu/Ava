const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const axios = require('axios');

const cron = require('node-cron');

exports.run = async (deletedMessage, pool, client) => {
	var current = 0
		current = await axios.get('https://raw.githubusercontent.com/2tuu/Kit/master/plugins/update.json');
		current = current.data.version;

	client.currentVersion = current;

	let version = require("./../plugins/update.json");
		client.version = version.version;
		client.codename = version.codename;

	console.log ('\x1b[32m', `Loaded ${client.totalCommands} modules - ${client.failedCommands.length} failed`);
	console.log('\x1b[34m%s\x1b[0m', "======================");
	if(parseInt(current) > parseInt(client.version) && parseInt(client.version) !== 0){
		console.error('Your framework is out of date');
		console.error(`The current Github version is: ` + current + '\n');
		console.error(`Your version is: ` + client.version + '\n');
		console.error('\x1b[36m%s\x1b[0m','\n To disable this notice, set your version number in /plugins/update.json to 0');
		console.log('\x1b[34m%s\x1b[0m', "======================");
	} else if(client.version == '0'){
		//disable version report
	} else {
		console.log('\x1b[36m%s\x1b[0m', `Version: ` + client.version + ' - ' + client.codename);
	}
	console.log('\x1b[36m%s\x1b[0m', `${client.users.cache.size} users - ${client.channels.cache.size} channels - ${client.guilds.cache.size} guilds`);
	console.log('\x1b[34m%s\x1b[0m', "=========log==========");
    
	client.user.setStatus('dnd');

    const logChannel = client.channels.resolve(config.logChannel);
    logChannel.send(`\`\`\`js
	Log-in Success:
	Version: ${data.version}

	User Cache: ${client.users.cache.size}
	Server Count: ${client.guilds.cache.size}
	\`\`\``)
	if(client.failedCommands.length>0){
		logChannel.send(`\`\`\`js
		ERROR LOADING COMMANDS: ${client.failedCommands}
		\`\`\``)
	}

	try{
		client.blacklist = await pool.query(`SELECT * FROM blacklist`);
		client.blacklist = client.blacklist.rows.map(g=>g.userid);
		console.log('\x1b[32m','Fetched blacklist');
	} catch(err) {
		console.error(`Problem fetching blacklist: ${err}`);
	}

	cron.schedule('* * * * *', async function() {

		var currenttime = Date.now();
		var remind = await pool.query(`SELECT * FROM timer`);
			remind = remind.rows;

		remind.forEach(e=> {
			var status = '';
			if(e.endtime < currenttime){

				if(currenttime - e.endtime > 300000){
					status = ' (delayed)';
				}

				client.channels.fetch(e.channelcreated)
				.then(channel => {
					channel.send(`<@${e.user}>, earlier you reminded me to tell you \`${e.message.replace(/[`]/g, '')}\`` + status);
					pool.query(`DELETE FROM timer WHERE "user" ='${e.user}'`);
				})
				.catch(console.error);	
			}
		});
	
	});

	client.logChannel = client.channels.resolve(config.logChannel);
	
  }
