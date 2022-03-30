const Discord = require("discord.js");

exports.run = async (client, message, args, deletedMessage, sql) => {
    if (!message.member.permissions.has('MANAGE_ROLES')) return message.reply("Sorry, you don't have permission to use this.");

    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .addField("Description", client.help['reactionroles'].help)
            .addField("Usage", '```' + client.help['reactionroles'].format + '```')
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

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

    switch (args[0].toLowerCase()) {
        case 'reset':
            sql.query(`UPDATE reactionroles SET roles = '{}' WHERE serverid = '${message.guild.id}'`);
            var embed = new Discord.MessageEmbed()
                .setDescription('Role list reset')
                .setColor(`0x${client.colors.good}`)
            return message.channel.send({ embeds: [embed] });
        case 'add':
            //format k?reaction Role Name -e :emote:
            var roleArgs = args.slice(1).join(' ').split('-e');
            if(!roleArgs[1]){
                var embed = new Discord.MessageEmbed()
                    .setDescription('Please give me an emote')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            } else if(roleArgs[0].length === 0){
                var embed = new Discord.MessageEmbed()
                    .setDescription('Please give me a role')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            }

            //findrole
            var emote = roleArgs[1].match(/[^\s:]+|:([^:]*):/g);
            if(emote.length < 3){
                var embed = new Discord.MessageEmbed()
                    .setDescription('Please give me an emote')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            }
                emote = emote[2].replace('>','');
            
            if(!client.emojiPile.includes(emote.toString())){
                //no emote
                var embed = new Discord.MessageEmbed()
                    .setDescription('Couldn\'t find that emote `"'+ emote +'"`')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            } else if (!findRole(roleArgs[0].slice(0, -1))){
                //no role
                var embed = new Discord.MessageEmbed()
                    .setDescription('Couldn\'t find that role`"'+ roleArgs[0].slice(0, -1) +'"`')
                    .setColor(`0x${client.colors.bad}`)
                return message.channel.send({ embeds: [embed] });
            }
            
            
            //add role to db object
            var row = await sql.query(`select * from reactionroles where serverid = '${message.guild.id}'`)
                row = row.rows[0];
                row = JSON.parse(row.roles);

            var updating = false;
                if(row[emote]) updating = true;

                row[emote] = {role: findRole(roleArgs[0].slice(0, -1)).id}
            
            //update db
            sql.query(`UPDATE reactionroles SET roles = '${JSON.stringify(row)}' WHERE serverid = '${message.guild.id}'`);
            
            //confirmation message
            if(updating) {
                var embed = new Discord.MessageEmbed()
                    .setDescription('Updated role')
                    .setColor(`0x${client.colors.good}`)
                return message.channel.send({ embeds: [embed] });
            } else {
                var embed = new Discord.MessageEmbed()
                    .setDescription('Added role')
                    .setColor(`0x${client.colors.good}`)
                return message.channel.send({ embeds: [embed] });
            }
            
        case 'delete':
            //add argument 'missing', looks for roles in list that are missing from server
            var row = await sql.query(`select * from reactionroles where serverid = '${message.guild.id}'`)
                row = row.rows[0];

            var roles = JSON.parse(row.roles);
            var final = {};

            row.roles.forEach(e=>{
                
            })

            if(args[1].toLowerCase() === 'missing'){
                //delete roles I can't find
            } else {
                //check against db object
                var role = findRole(args.slice(1).join(' ').toLowerCase())
                //remove if present, error if not
            }
            break;

        case 'setmessage':
            //find message by ID (this is a message a staff member has already sent)
                //maybe option to find most recent message in a channel
            //clear all reactions on selected message

            //add reactions from db object
            //error if can't find emote

            //change message id in db object
            break;
        
        default:
            //incorrect args error
            break;
    }
}

exports.conf = {
    name: "Reaction Roles [BETA]",
    help: "Add role reactions to a message in your rules channel",
    format: "[IN PROGRESS]",
    DM: false,
    ownerOnly: true,
    alias: ['react'],
    slashCommand: true,
    data: {
        name: "reactionrole",
        description: "Set up reaction roles",
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
        default_permission: undefined
    }
}