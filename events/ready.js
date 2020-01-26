const fs = require('fs');
let data = JSON.parse(fs.readFileSync("./JSON/data.json", "utf8"));
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

exports.run = (sdeletedMessage, sql, client) => {
    console.log("Client Logon Successful");
	console.log('\x1b[32m', "======================");
	console.log("");
	console.log('\x1b[33m', `Version: ` + data.version);
	console.log("");
	console.log('\x1b[32m', "======================");
	console.log('\x1b[33m', `${client.users.size} users - ${client.channels.size} channels - ${client.guilds.size} guilds.`);
	console.log('\x1b[32m', "=========log==========");

	client.user.setActivity(data.status);
    client.user.setStatus('online');
    
    const logChannel = client.channels.get(config.logChannel);
    logChannel.send(`\`\`\`js
	Log-in Success:
	Version: ${data.version}

	User Cache: ${client.users.size}
	Server Count: ${client.guilds.size}
	\`\`\``)
	
  }
