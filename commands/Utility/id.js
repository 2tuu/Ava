const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql) => {
    function findRole(arg){
        //find role by id or name
        rname = message.guild.roles.cache.find(r => r.name.toLowerCase() === arg);
        rid = message.guild.roles.cache.find(r => r.id === arg);

        if(!rname && !rid){
            return false;
        } else {
            if(rname){
                return rname;
            } else {
                return rid;
            }
        }
    }

    if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['id'].help)
			.addField("Usage", '```' + client.help['id'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

    switch (args[0].toLowerCase()) {
        case 'role':
            var role = findRole(args.slice(1).join(' ').toLowerCase());

            if(role){
                var embed = new Discord.MessageEmbed()
                    .setDescription('ID: ```' + role.id + '```')
                return message.channel.send({ embeds: [embed] });
            } else {
                var embed = new Discord.MessageEmbed()
                    .setDescription('Couldn\'t find that role')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            }
        case 'me':
            var embed = new Discord.MessageEmbed()
                .setDescription('ID: ```' + message.author.id + '```')
            return message.channel.send({ embeds: [embed] });
        case 'server':
            var embed = new Discord.MessageEmbed()
                .setDescription('ID: ```' + message.guild.id + '```')
            return message.channel.send({ embeds: [embed] });
        case 'emote':
            try{
                var emote = args[1].match(/[^\s:]+|:([^:]*):/g);
                    emote = emote[2].replace('>','');

                const embed = new Discord.MessageEmbed()
                    .setDescription('ID: ```' + emote + '```')
                return message.channel.send({ embeds: [embed] });
            } catch (err) {
                var embed = new Discord.MessageEmbed()
                    .setDescription('Couldn\'t find that emote')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            }
        default:
            var embed = new Discord.MessageEmbed()
                .setDescription('Incorrect syntax')
                .setColor(`0x${client.colors.bad}`)
            return message.channel.send({ embeds: [embed] });
    }
}

exports.conf = {
    name: "ID Finder [BETA]",
    help: "Find something's ID",
    format: `k?id role [role name]
k?id me
k?id server
k?id emote [:emote:]`,
    DM: false,
    ownerOnly: false,
    alias: [],
    slashCommand: false
}