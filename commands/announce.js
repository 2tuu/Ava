
const Discord = require('discord.js');

exports.run = async (client, message, args, deletedMessage, sql) => {

    try{

    var channel;

    if(args.join(' ').match(/-c <#(.*?)>/g)){
        var chan = args.join(' ').match(/-c <#(.*?)>/g);
        chan = chan[0].replace('-c <#','').replace('>','');

        if(message.guild.channels.get(chan)){
            channel = message.guild.channels.get(chan);
        }
    }

    var row = await sql.get(`SELECT * FROM announce WHERE guild ="${message.guild.id}"`);
    var ch;

    if(channel){
        ch = channel;
    } else {
        ch = message.guild.channels.get(row.channel);
    }

	const hex = /^#?[0-9A-F]{6}$/i;

    if(message.author.id === "378769654942007299" || message.member.permissions.has('MANAGE_MESSAGES')){ 


        if(args[0].toLowerCase() === "setchannel"){
            if(!args[1]){
                return message.channel.send('Please give me a channel ID or mention a channel');
            } else {
                sql.run(`UPDATE announce SET channel = "${args[1].replace('<#', '').replace('>','')}" WHERE guild = "${message.guild.id}"`);
                return message.channel.send('Channel set to ID: `' + args[1].replace('<#', '').replace('>','') + '`');
            }
        } if(hex.test(args[0])){
          //  if(!message.guild.channels.get(row.channel)) return message.channel.send('The channel ID you set is invalid or not set\nUse `k?announce setchannel #channel` to set it')
            
            //send embed, color set to args[0].replace("#", "")
             const embed = new Discord.RichEmbed()
      .setColor('0x' + args[0].replace("#", ""))
      .setDescription(args.slice(1).join(' ').replace(new RegExp(/-c <#(.*?)>/g) , ''))
      .setFooter('Announcement')
      .setTimestamp()
      ch.send({embed});
        } else {
            
           // if(!message.guild.channels.get(row.channel)) return message.channel.send('The channel ID you set is invalid or not set\nUse `k?announce setchannel #channel` to set it')
            //send normal embed, no color
             const embed = new Discord.RichEmbed()
      .setDescription(args.join(' ').replace(new RegExp(/-c <#(.*?)>/g) , ''))
      .setFooter('Announcement')
      .setTimestamp()
      ch.send({embed});
        }

        //message.delete().catch(O_o=>{});
    
        //var chan = client.channels.find('id', args[0]);
        //chan.send(args.slice(1).join(' '));
        
        } else { message.channel.send("You do not have permission to use this (MANAGE_MESSAGES Required)"); }
    

    } catch(err){
        message.channel.send('An error occured\n```js\n' + err + '\n```');
    }

    }

    exports.conf = {
        DM: true,
        OwnerOnly: false
    }
    