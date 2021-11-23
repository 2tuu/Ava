const Discord = require("discord.js");
const tagReader = require('../plugins/tag.js');

exports.run = async (client, message, args, deletedMessage, sql) => {

    //get all tags for appropriate server
    var tags = await sql.query(`SELECT * FROM tags WHERE serverId ='${message.guild.id}'`);

    tags = tags.rows;

        tagnames = tags.map(g=>g.tagname);
        //structure {serverid:'', tagname: '', tagcontent: '', ownerid: '', selfdelete: ''}

    if(!args[0]){
        const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setDescription("This command needs at least 1 argument")
        message.channel.send({embed});
    }

    var arg = args[0].toLowerCase();

    switch(arg) {
        case 'create':
            if(!args[1]) return;
            var tagContentVar = args.slice(2).join(' ');
            var Attachment = (message.attachments).array();
            tagContentVar = tagContentVar + Attachment.map(r => r.url).join(', ');

            if(tagContentVar.length < 1){
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription("Give me something to put in the tag")
                return message.channel.send({embed});
            }

            var tag = await sql.query(`SELECT * FROM tags WHERE serverid ='${message.guild.id}' AND tagname = '${args[1].toLowerCase()}'`);
            if(!tag.rows[0]){
                sql.query(`INSERT INTO tags (serverId, tagName, tagContent, ownerID, selfDelete) VALUES (${message.guild.id}, '${args[1].toLowerCase()}', '${tagContentVar}', '${message.author.id}', 'false')`);

                const embed = new Discord.MessageEmbed()
                .setDescription(`Tag '${args[1].toLowerCase()}' created`)
                return message.channel.send({embed});
            } else {
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription("This tag already exists")
                return message.channel.send({embed});
            }
            return;
        case 'edit':
            if(!args[1]) return;
            var tag = await sql.query(`SELECT * FROM tags WHERE serverid ='${message.guild.id}' AND tagname = '${args[1].toLowerCase()}'`);
            if(!tag.rows[0]){
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription("This tag doesn't exist")
                return message.channel.send({embed});
            } else {
                if(tag.rows[0].ownerid !== message.author.id){
                    const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription("This tag doesn't belong to you")
                    return message.channel.send({embed});
                }
                if(args.slice(2).join(' ').length < 1){
                    const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription("Your tag can't be empty")
                    return message.channel.send({embed});
                }
                sql.query(`UPDATE tags SET tagContent = '${args.slice(2).join(' ')}' WHERE serverId ='${message.guild.id}' AND tagName = '${args[1].toLowerCase()}'`);
                const embed = new Discord.MessageEmbed()
                .setDescription("Your tag was edited")
                return message.channel.send({embed});
            }
            return;
        case 'delete':
            if(!args[1]) return;
            var tag = await sql.query(`SELECT * FROM tags WHERE serverid ='${message.guild.id}' AND tagname = '${args[1].toLowerCase()}'`);
            if(!tag.rows[0]){
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription("This doesn't exist")
                return message.channel.send({embed});
            } else {
                if(tag.rows[0].ownerid !== message.author.id){
                    const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription("This tag doesn't belong to you")
                    return message.channel.send({embed});
                }
                sql.query(`DELETE FROM tags WHERE serverId ='${message.guild.id}' AND tagName = '${args[1].toLowerCase()}'`);
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription("This tag has been deleted")
                return message.channel.send({embed});
            }
            return;
        case 'search':
            if(!args[1]) return;
            var tag = await sql.query(`SELECT * FROM tags WHERE serverId = '${message.guild.id}' AND tagName LIKE '%${args[1]}%' `);
            
            if(!tag.rows[0]){
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription("No tags were found")
                return message.channel.send({embed});
            } else {
                var results = tag.rows.map(g=>g.tagname);
                message.channel.send('Results:\n```' +
                results.join(', ')
                + '```');
            }
            return;
        case 'random':
            if(!args[0]) return;
            var tag = await sql.query(`SELECT * FROM tags WHERE serverId ='${message.guild.id}' ORDER BY RANDOM() LIMIT 1`);
            if(!tag.rows[0]){
                const embed = new Discord.MessageEmbed()
                .setColor(`0x${client.colors.bad}`)
                .setDescription("No tags were found")
                return message.channel.send({embed});
            } else {
                var result = tag.rows[0].tagcontent;
                var t = tagReader.read(result,message,[]);

                    message.channel.send(t).catch((err)=>{
                        message.channel.send(`There was an error loading this tag (${tag.rows[0].tagname})`)
                    });
            }
            return;
        case 'list':
            var results = await sql.query(`SELECT * FROM tags WHERE serverId ='${message.guild.id}' AND ownerid = '${message.author.id}'`);
                results = results.rows;

                if(results.length < 1){
                    const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription("You don't have any tags")
                    return message.channel.send({embed});
                }

                function chunkArray(myArray, chunk_size){
                    var index = 0;
                    var arrayLength = myArray.length;
                    var tempArray = [];
                    
                    for (index = 0; index < arrayLength; index += chunk_size) {
                        myChunk = myArray.slice(index, index+chunk_size);
                        tempArray.push(myChunk);
                    }
                
                    return tempArray;
                }

                results = results.map(g=>g.tagname);
                results = chunkArray(results, 30);

                var sendUser = await client.users.fetch(message.author.id);

                    sendUser.send('List:').catch((err)=>{
                        const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setDescription("An error occured: `" + err + "`")
                        return message.channel.send({embed});
                    });

                var e = 0;
                while( e < results.length){
                    sendUser.send(results[e].join(', ')).catch((err)=>{});
                    e = e+1;
                }
            return;
        default:
            if(tagnames.includes(args[0].toLowerCase())){
                var results = await sql.query(`SELECT * FROM tags WHERE serverId ='${message.guild.id}' AND tagname = '${args[0]}'`);
                results = results.rows[0];
                
                var t = tagReader.read(results.tagcontent,message,args);
                    message.channel.send(t).catch((err)=>{
                        const embed = new Discord.MessageEmbed()
                        .setColor(`0x${client.colors.bad}`)
                        .setDescription("An error occured: `" + err + "`")
                        return message.channel.send({embed});
                    });
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(`0x${client.colors.bad}`)
                    .setDescription("There is no tag with that name")
                    return message.channel.send({embed});
            }
          return; 
      } 

  }
  
  exports.conf = {
    category: "Fun",
    name: "Tag",
    help: "Create, destroy or edit a tag - For more information on how to structure a tag, click [here](https://github.com/2tuu/Kit/blob/master/docs/tags.md)",
    format: "k?tag [tag-name/create/edit/delete/search/random]",
    DM: false,
    OwnerOnly: false,
    alias: ['t']
}