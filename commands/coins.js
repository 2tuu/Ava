const Discord = require('discord.js');

function dhm(t){
	var cd = 24 * 60 * 60 * 1000,
		ch = 60 * 60 * 1000,
		d = Math.floor(t / cd),
		h = Math.floor( (t - d * cd) / ch),
		m = Math.round( (t - d * cd - h * ch) / 60000),
		pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
	h++;
	m = 0;
  }
  if( h === 24 ){
	d++;
	h = 0;
  }

  var time = [d, pad(h), pad(m)];

  return h + " hours and " + m + " minutes";
}

exports.run = (client, message, args, deletedMessage, sql) => {

	//return message.channel.send("This command is temporarily disabled");
	
    var kitSupport = client.guilds.find('id', '449263514436239360');
    var donorArray = kitSupport.roles.find('id', '479013774880276502').members.array();
    var donorIDArray = [];
    
    var i = 0;
    while((i+1) <= donorArray.length){
        donorIDArray[i] = donorArray[i].user.id;
        i = i+1;
    }


    var IDarray = donorIDArray;

	if(args[0] === "add"){
		sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {
		
			if(!row){
				const embed = new Discord.RichEmbed()
					.setColor(0xF46242)
					.setTimestamp()
					.setDescription("Create a profile first")
					.setFooter("Use k?profile create")
					message.channel.send({embed});
			} else {
		
		if(message.createdTimestamp > row.qTime || !row.qTime){

				if(donorIDArray.includes(message.author.id)){
					sql.run(`UPDATE profile SET quarters = "${parseInt(row.quarters) + 4}" WHERE userId = "${message.author.id}"`);
					sql.run(`UPDATE profile SET qTime = "${message.createdTimestamp + 24*60*60*1000}" WHERE userId = "${message.author.id}"`);

				const embed = new Discord.RichEmbed()

					.setDescription("You got 4 quarters")
					//.setFooter(row.qTime)
				message.channel.send({embed});
				} else {
					sql.run(`UPDATE profile SET quarters = "${parseInt(row.quarters) + 1}" WHERE userId = "${message.author.id}"`);
					sql.run(`UPDATE profile SET qTime = "${message.createdTimestamp + 24*60*60*1000}" WHERE userId = "${message.author.id}"`);

				const embed = new Discord.RichEmbed()

					.setTimestamp()
					.setDescription("You got a quarter")
				message.channel.send({embed});
				}

			} else {
				return message.reply("There is a 24 hour cooldown on this command, try again in " + dhm(row.qTime - message.createdTimestamp));
			}
	  }
	});
    } else if(args[0] === "raw"){

		sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {

				const embed = new Discord.RichEmbed()
					.setColor(0xF46242)
					.addField('userId', row.userId)
					.addField('quarters', row.quarters)
					.addField('badge', row.badge)
					.addField('desc', row.desc)
					.addField('color', row.color)
					.addField('cmds', row.cmds)
					.addField('bg', row.bg)
					.addField('qTime', row.qTime)
				message.channel.send({embed});

		});

	} else if(args[0] === "leaderboard"){

		sql.all(`SELECT * FROM profile`).then(row => {

			//console.log(row);
			//console.log(row.length);

			var i = 1;
			var ar = [];
			while(i < row.length){
				ar[i-1] = {
					userId: row[i-1].userId,
					quarters: parseInt(row[i-1].quarters)
				};
				i = i + 1;
			}


				ar = ar.sort(function(a, b) {
					return parseFloat(b.quarters) - parseFloat(a.quarters);
				});

				var a = 0;
				var ara = "";
				var name;
				while(a < 10){
					if(client.users.get(ar[a].userId)){
						name = name + (a+1) + '. ' + client.users.get(ar[a].userId).tag + ' - ' + ar[a].quarters + "\n";
					} else {
						name = name + (a+1) + '. ' + "User Missing - " + ar[a].quarters + "\n";
					}

					a = a + 1;
				};


			message.channel.send('```' + 
						name.replace('undefined', '').replace('NaN', '1')
			        + '```');
		});

	} else if(args[0] === "get"){
		//search for user
		sql.get(`SELECT quarters FROM profile WHERE userId ="${args[0]}"`).then(row => {
			if(!row){
				//make profile first
				const embed = new Discord.RichEmbed()
					.setColor(0xF46242)
					.setTimestamp()
					.setDescription("Create a profile first")
					.setFooter("Use `k?profile`")
					message.channel.send({embed});

			} else {
		//sql.run(`UPDATE profiles SET quarters = "${row.quarters + 1}" WHERE userId = "${message.author.id}"`);
		const embed = new Discord.RichEmbed()

				.setTimestamp()
				.setDescription("This user has " + row.quarters + " quarters")
				message.channel.send({embed});
				}
			//you got one point
			

		});

	} else if(args[0] === "give"){

		if(message.author.id === "378769654942007299"){
			sql.run(`UPDATE profile SET quarters = "${args[1]}" WHERE userId = "${args[2]}"`);
		}

	} else {
		//display sender's
		sql.get(`SELECT quarters FROM profile WHERE userId ="${message.author.id}"`).then(row => {
			if(!row){
				//make profile first
				const embed = new Discord.RichEmbed()
					.setColor(0xF46242)
					.setTimestamp()
					.setDescription("Create a profile first")
					.setFooter("Use k?profile create")
					message.channel.send({embed});

			} else {
				sql.get(`SELECT * FROM profile WHERE userId ="${message.author.id}"`).then(row => {
				if (message.createdTimestamp > row.qTime || !row.qTime) {
					const embed = new Discord.RichEmbed()

						.setTimestamp()
						.setColor(0x32ff58)
						.setDescription("You have " + row.quarters + " quarters")
					message.channel.send({embed});
			} else {

				const embed = new Discord.RichEmbed()

				.setColor(0xF46242)
				.setDescription("You have " + row.quarters + " quarters")
				.setFooter("Get more in " + dhm(row.qTime - message.createdTimestamp))
				message.channel.send({embed});
			}
			//you got one point
			});
		}
		});

  }

}

exports.conf = {
    DM: true,
    OwnerOnly: false
}
