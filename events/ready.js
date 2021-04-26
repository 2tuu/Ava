const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

const cron = require('node-cron');
const express = require('express');

exports.run = async (sdeletedMessage, sql, client) => {
    console.log("Client Logon Successful");
	console.log('\x1b[32m', "======================");
	console.log("");
	console.log('\x1b[33m', `Version: ` + data.version);
	console.log("");
	console.log('\x1b[32m', "======================");
	console.log('\x1b[33m', `${client.users.cache.size} users - ${client.channels.cache.size} channels - ${client.guilds.size} guilds.`);
	console.log('\x1b[32m', "=========log==========");

	client.user.setActivity(data.status);
    client.user.setStatus('online');
    
    const logChannel = client.channels.resolve(config.logChannel);
    logChannel.send(`\`\`\`js
	Log-in Success:
	Version: ${data.version}

	User Cache: ${client.users.cache.size}
	Server Count: ${client.guilds.cache.size}
	\`\`\``)

	try{
		client.blacklist = await sql.all(`SELECT * FROM blacklist`);
		console.log('Fetched blacklist');
	} catch(err) {
		console.error(err);
	}

	cron.schedule('* * * * *', async function() {

		var currenttime = Date.now();
		var remind = await sql.all(`SELECT * FROM timer`);

		remind.forEach(e=> {
			var status = '';
			if(e.endtime < currenttime){

				if(currenttime - e.endtime > 300000){
					status = ' (delayed)';
				}

				client.channels.fetch(e.channelcreated)
				.then(channel => {
					channel.send(`<@${e.user}>, earlier you reminded me to tell you \`${e.message}\`` + status);
					sql.run(`DELETE FROM timer WHERE user ="${e.user}"`);
				})
				.catch(console.error);	
			}
		});
	
	});


	//Blacklist parser (initialized in events/ready)
	client.blist = [];
	client.blacklist.forEach(e => {
  		client.blist.push(e.userid);
	});
	
  }
