const Discord = require(`discord.js`);

exports.run = async (client, message, args, deletedMessage, sql) => {

    if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['role'].help)
			.addField("Usage", '```' + client.help['role'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

    var dbResult = await sql.query(`SELECT * FROM giverole WHERE serverid ='${message.guild.id}'`);
    var roleArray = dbResult.rows[0].rolearray;

    roleArray = roleArray.split(',');
    roleArray = roleArray.filter(e => e !== '');
    roleArrayText = [];

    if (!args[0]) return client.messageHandler(message, client.isInteraction, "I need more information than that");

    if (args[0].toLowerCase() === 'list') {

        if (roleArray.length < 1) return client.messageHandler(message, client.isInteraction, 'Sorry, it looks like this server has no roles in it\'s list\nUse k?roles add "role name" to add some');

        roleArrayText = roleArray.map(a => '<@&' + a + '>').join(' • ').toString().replace('\n', '').replace(/,/g, ' ');

        const embed = new Discord.MessageEmbed()
            .addField("Use 'k?role <role name>' to give yourself one", roleArrayText)
        client.messageHandler(message, client.isInteraction, { embeds: [embed] });

    } else if (args[0].toLowerCase() === 'add') {

        if (!args[1]) return client.messageHandler(message, client.isInteraction, "I need more information than that");
        var nono = ['list', 'add', 'delete', 'missing', 'remove'];
        if (nono.includes(args[1].toLowerCase())) return client.messageHandler(message, client.isInteraction, "Please use another name for your role");
        if (!message.member.permissions.has('MANAGE_ROLES')) return message.reply("Sorry, you don't have permission to use this.");

        if (!isNaN(parseInt(args[1]))) { //ugly - fix later
            var res = message.guild.roles.cache.find(r => r.id === args[1]);
            if (!res) return client.messageHandler(message, client.isInteraction, "Sorry, I can't find a role with that ID");
            roleID = res.id;

            var row = await sql.query(`SELECT * FROM giverole WHERE serverid ='${message.guild.id}'`);
            row = row.rows[0];

            if (!row.rolearray.split(',').includes(res.id)) {
                var final = row.rolearray.split(',');
                final.push(res.id);
                final = final.filter(e => e !== '');
                final = final.join(',');

                sql.query(`UPDATE giverole SET rolearray = '${final}' WHERE serverid ='${message.guild.id}'`);
                return client.messageHandler(message, client.isInteraction, `I've added the role '${res.name}' to your list`);
            } else {
                return client.messageHandler(message, client.isInteraction, `This role is already on the list`);
            }

        } else if (args[1].startsWith('<@&')) {

            var res = args[1].replace('<@&', '');
            res = res.replace('>', '');

            res = message.guild.roles.cache.find(r => r.id === res);
            if (!res) return client.messageHandler(message, client.isInteraction, "Sorry, I can't find that role");
            roleID = res.id;

            var row = await sql.query(`SELECT * FROM giverole WHERE serverid ='${message.guild.id}'`);
            row = row.rows[0];

            if (!row.rolearray.split(',').includes(res.id)) {
                var final = row.rolearray.split(',');
                final.push(res.id);
                final = final.filter(e => e !== '');
                final = final.join(',');

                sql.query(`UPDATE giverole SET rolearray = '${final}' WHERE serverid ='${message.guild.id}'`);
                const embed = new Discord.MessageEmbed()
                    .setDescription(`I've added the role '${res.name}' to your list`)
                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
            } else {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`This role is already on the list`)
                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
            }

        } else {
            var res = args.slice(1).join(' ').toLowerCase();
            if (!message.guild.roles.cache.find(r => r.name.toLowerCase() === res)) {
                var friendlynames;

                const embed = new Discord.MessageEmbed()
                    .setDescription("Sorry, I can't find that role")
                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
            }
            res = message.guild.roles.cache.find(r => r.name.toLowerCase() === res);

            var row = await sql.query(`SELECT * FROM giverole WHERE serverid ='${message.guild.id}'`);
            row = row.rows[0];

            if (!row.rolearray.split(',').includes(res.id)) {
                var final = row.rolearray.split(',');
                final.push(res.id);
                final = final.filter(e => e !== '');
                final = final.join(',');

                sql.query(`UPDATE giverole SET rolearray = '${final}' WHERE serverid ='${message.guild.id}'`);
                const embed = new Discord.MessageEmbed()
                    .setDescription(`I've added the role '${res.name}' to your list`)
                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
            } else {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`This role is already on the list`)
                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
            }

        }
    } else if (args[0].toLowerCase() === 'delete') {
        if (!message.member.permissions.has('MANAGE_ROLES')){
            const embed = new Discord.MessageEmbed()
                .setDescription("Sorry, you don't have permission to use this.")
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }

        if (!args[1]){
            const embed = new Discord.MessageEmbed()
                .setDescription("I need more information than that")
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }

        var row = await sql.query(`SELECT * FROM giverole WHERE serverid ='${message.guild.id}'`);
        row = row.rows[0];

        if (args[1].toLowerCase() === 'missing') {
            var res = row.rolearray.split(',');

            res.forEach(a => {
                if (!message.guild.roles.cache.find(r => r.id === a)) {
                    res = res.filter(e => e !== a);
                }
            });
            res = res.join(',');
            sql.query(`UPDATE giverole SET rolearray = '${res}' WHERE serverid ='${message.guild.id}'`);
            const embed = new Discord.MessageEmbed()
                .setDescription("I've removed every role I couldn't find from the list")
            client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        } else {

            var res = message.guild.roles.cache.find(r => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
            if (!res){
                const embed = new Discord.MessageEmbed()
                    .setDescription("Sorry, I can't find that role - Try checking 'k?help roles'")
                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
            }
            if (!row.rolearray.includes(res.id)){
                const embed = new Discord.MessageEmbed()
                    .setDescription("Sorry, that role isn't on the list")
                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
            }

            var roleName = res.name;
            res = row.rolearray.split(',').filter(e => e !== res.id).join(',');
            sql.query(`UPDATE giverole SET rolearray = '${res}' WHERE serverid ='${message.guild.id}'`);
            const embed = new Discord.MessageEmbed()
                .setDescription(`'${roleName}' has been removed from the list`)
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }
    } else {
        var res = message.guild.roles.cache.find(r => r.name.toLowerCase() === args[0].toLowerCase());
        var row = await sql.query(`SELECT * FROM giverole WHERE serverid ='${message.guild.id}'`);
        row = row.rows[0];


        if (!res || !row.rolearray.includes(res.id)) {
            var friendlynames = [];
            roleArray.forEach(a => {
                var res = message.guild.roles.cache.find(r => r.id === a);
                if (res.name.toLowerCase().includes(args[0].toLowerCase())) {
                    friendlynames.push(res);
                }
            });

            if (friendlynames.length < 1) {
                const embed = new Discord.MessageEmbed()
                    .setDescription("Sorry, that role isn't on the list")
                return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
            } else {
                friendlynames = friendlynames.sort((a, b) => a.name.length - b.name.length);
                res = friendlynames[0];
            }
        }


        if (message.member._roles.includes(res.id)) {
            try {
                message.member.roles.remove(res);
            } catch (err) {
                return client.messageHandler(message, client.isInteraction, "An error occured: " + err);
            }
            const embed = new Discord.MessageEmbed()
                .setDescription(`'${res.name}' has been removed`)
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        } else {
            try {
                //console.log(res.permissions);
                if(res.permissions.has('ADMINISTRATOR')){
                    return client.messageHandler(message, client.isInteraction, "I can't give you that role");
                };
                message.member.roles.add(res);
            } catch (err) {
                return client.messageHandler(message, client.isInteraction, "An error occured: " + err);
            }
            const embed = new Discord.MessageEmbed()
                .setDescription(`You've been given '${res.name}'`)
            return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }

    }

}

exports.conf = {
    name: "Roles [BETA]",
    help: "Give yourself a role from a pre-determined list",
    format: "k?role list\nk?role [role] <- gives and removes role\nk?role add [role ID / @role / role name]\nk?role delete [role name]\n\nDoes a role on the list not exist anymore? Use 'k?role delete missing'",
    DM: false,
    ownerOnly: false,
    alias: ['giveme', 'gimme', 'roles'],
    slashCommand: true,
    data: {
        name: "role",
        description: "Self-assigned roles",
        options: [
            {
                choices: undefined,
                autocomplete: undefined,
                type: 3,
                name: 'options',
                description: 'Type arguments here',
                required: true
            }
        ],
        dm_permission: false
    }
}