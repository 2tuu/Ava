exports.run = async (client, message, args, deletedMessage, sql) => {

    var userEntry = await sql.get(`SELECT * FROM codeUsers WHERE userId = "${message.author.id}"`);

    if(!message.guild.id === '364178349838434306') return;

    if(args[0] === 'addcode'){
        var points = 1;

        if(args[1]){
            if(isNaN(args[1])){
                return message.channel.send("That's not a valid number");
            } else {
                if(parseInt(args[1]) < 1){
                    return message.channel.send('Enter a point value higher than 0');
                } else {
                    points = Math.floor(parseInt(args[1]));
                }
            }
        }

        var uses = 1;

        if(args[2]){
            if(isNaN(args[2])){
                return message.channel.send("That's not a valid number");
            } else {
                if(parseInt(args[2]) < 1){
                    return message.channel.send('Enter a use value higher than 0');
                } else {
                    uses = Math.floor(parseInt(args[1]));
                }
            }
        }

        
        var code = Date.now().toString(36).slice(1);
        //check for my id
        if(message.author.id === '378769654942007299'){
            sql.run("INSERT INTO codes (code, valid, points, uses, users) VALUES (?, ?, ?, ?, ?)", [code, 'true', points, uses, `{''users'': []}`]);
            message.channel.send(`New code added: \`${code}\``)
        }
    } else if(args[0] === 'lb' || args[0] === "list"){
        sql.all(`SELECT * FROM codeUsers`).then(row => {

			//console.log(row);
			//console.log(row.length);

			var i = 1;
			var ar = [];
			while(i < row.length+1){
                if(row[i-1]){
				ar[i-1] = {
					userId: row[i-1].userId,
					points: parseInt(row[i-1].points)
				};
                i = i + 1;
                } else {
                    i = i + 1;
                }
			}


				ar = ar.sort(function(a, b) {
					return parseFloat(b.points) - parseFloat(a.points);
				});

				var a = 0;
				var ara = "";
                var name;
                
                var count = row.length + 1;
                if(count > 10) count = 10;

				while(a < count-1){
                    if(ar[a]){
					if(client.users.get(ar[a].userId)){
						name = name + (a+1) + '. ' + client.users.get(ar[a].userId).tag + ' - ' + ar[a].points + "\n";
					} else {
						name = name + (a+1) + '. ' + "User Missing - " + ar[a].points + "\n";
					}

                    a = a + 1;
                } else {
                    a = a + 1;
                }
				};


			message.channel.send('```' + 
						name.replace('undefined', '').replace('NaN', '1')
			        + '```');
		});
    } else {
        //check code by argument
        if(!args[0]){
            message.channel.send('No code was given');
        } else {
            var row = await sql.get(`SELECT * FROM codes WHERE code = "${args[0]}"`);
            if(!row){
                //invalid code
                message.channel.send('That code does not exist');
            } else {
                //Invalidate code
                if(row.valid === 'true'){

                    var users = JSON.parse(row.users.replace(new RegExp("''", 'g'), '"'));
                    var codeUses = parseInt(row.uses);

                    //if(users.includes(message.author.id)) return message.channel.send('You already used this code once');

                    if(users.users.length >= codeUses){
                        sql.run(`UPDATE codes SET valid = "false" WHERE code = "${args[0]}"`);
                        return message.channel.send ('This code has run out of uses (Max: ' + row.uses + ')');
                    } else {
                        users.users[users.users.length] = message.author.id;
                        sql.run(`UPDATE codes SET users = "${JSON.stringify(users).replace(new RegExp('"', 'g'), "''")}" WHERE code = "${args[0]}"`);
                    }

                    if(userEntry){
                        sql.run(`UPDATE codeUsers SET points = ${parseInt(userEntry.points) + row.points} WHERE userId = "${message.author.id}"`)
                        message.channel.send(`Code validated, you have ${parseInt(userEntry.points) + parseInt(row.points)} points`);
                    } else {
                        sql.run("INSERT INTO codeUsers (userId, points) VALUES (?, ?)", [message.author.id, parseInt(row.points)]);
                        message.channel.send('Code validated, you have ' + row.points + ' point(s)');
                    }
                    //send conf message inside if
                } else {
                    //code already invalidated
                    message.channel.send('This code was already validated');
                }
            }
        }
    }
}

exports.conf = {
DM: false,
OwnerOnly: false
}