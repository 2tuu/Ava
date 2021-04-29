const Discord = require("discord.js");
const tag = require('./../plugins/tag.js');
const config = require("./../config.json");

exports.run = async (client, message, args, deletedMessage, sql) => {

    var row;

    //maybe get rid of this
    row = sql.get(`SELECT * FROM tags WHERE serverId ="${message.guild.id}"`);
        if (!row) {
          sql.run(`INSERT INTO tags (serverId, tagName, tagContent, ownerID, selfDelete) VALUES (${message.guild.id}, "tags", "This command saves a tag with a specified content", ${client.user.id}, "false")`);
        } 

    

    var tagContentVar = args.join(' ');
    tagContentVar = tagContentVar.replace(args[0], "");
    tagContentVar = tagContentVar.replace(args[1], "");

    var Attachment = (message.attachments).array();
    tagContentVar = tagContentVar + Attachment.map(r => r.url).join(', ');

    console.log("TagContent: " + tagContentVar);
    console.log("Attach: " + Attachment.map(r => r.url).join(', '));


if(args[0] === "create"){

    row = sql.get(`SELECT tagName FROM tags WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);
        if(!tagContentVar || tagContentVar.length == 0 || !args[1]){ 
            message.channel.send("A tag's name and content cannot be blank");
        } else if(args[1].length > 30){
            return message.channel.send("This tag name is too long (Limit: 30 Characters)");
        } else if(!row){
          sql.run(`INSERT INTO tags (serverId, tagName, tagContent, ownerID, selfDelete) VALUES ('${message.guild.id}', '${args[1].toLowerCase()}', '${tagContentVar}', '${message.author.id}', 'false')`);
          message.channel.send("Your tag has been created");
        } else {
            message.channel.send("A tag with this name already exists");
        }

    }else if(args[0] === "search"){

    row = sql.all(`SELECT tagName FROM tags WHERE serverId = "${message.guild.id}" AND tagName LIKE "%${args[1]}%" `);
        if(!row){
            message.channel.send("No tags were found");
        
        } else if(args[1].length < 3){
            message.channel.send("Please use 3 or more characters");
        
        } else {
            console.log(row);

            var tagList = [];
            var i = 1;

            while(i <= row.length){
                tagList[i-1] = row[i-1].tagName;
                i = i+1;
            }

            message.channel.send(row.length + " Results:\n" + tagList.join(', '));
        }
    
}else if(args[0] === "random"){

    if(!args[1]){
    row = sql.get(`SELECT * FROM tags WHERE serverId ="${message.guild.id}" ORDER BY RAND() LIMIT 1`);
        if(!row){
            message.channel.send("No tags were found");
        } else {
            //Import tag handler again - async is dumb
            const tagHandler = require('./../plugins/tag.js');
            
            async function tag(tag){
                var t = await tag.read(row.tagContent,message,args);
                message.channel.send('"' + row.tagName + '": ' + t);
            }
            tag(tagHandler);
        }
    } else {
        //LIKE '%${args.slice().join(' ')}%'
        row = sql.get(`SELECT * FROM tags WHERE serverId ="${message.guild.id}" AND tagName LIKE "%${args.slice(1).join(' ')}%" ORDER BY RAND() LIMIT 1`);
            if(!row){
                message.channel.send("No tags were found");
            } else {
                //Import tag handler again - async is dumb
                const tagHandler = require('./../plugins/tag.js');

                async function tag(tag){
                    var t = await tag.read(row.tagContent,message,args);
                    message.channel.send('"' + row.tagName + '": ' + t);
                }
                tag(tagHandler);
            }
    }

} else if(args[0] === "edit"){

    row = sql.get(`SELECT * FROM tags WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);

        console.log(row);
        if(!row){
            message.channel.send("A tag with this name does not exist");
        } else {
            var authorID = (message.author.id).toString();

            var tagContentVari = (args.join(' ')).replace(args[0], "");
            tagContentVari = tagContentVari.replace(args[1], "");

            if(authorID !== `${row.ownerID}`){
                message.channel.send(`OwnerID: ${row.ownerID} \nAuthorID: ${authorID}\n You do not own this tag`);
            } else {
                if(!args[2]) return message.channel.send("A tag cannot be empty");

            sql.run(`UPDATE tags SET tagContent = "${tagContentVari}" WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);
            message.channel.send("This tag has been edited");
            }
        }
    
      //Caller delete - don't know if I want this here anymore
    } /*else if(args[0] === "cdel"){

        row = sql.get(`SELECT * FROM tags WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);

            console.log(row);
            if(!row){
                message.channel.send("A tag with this name does not exist");
            } else {
                var authorID = (message.author.id).toString();
    
                var tagContentVari = (args.join(' ')).replace(args[0], "");
                tagContentVari = tagContentVari.replace(args[1], "");
    
                if(authorID !== row.ownerID){
                    message.channel.send(`OwnerID: ${row.ownerID} \nAuthorID: ${authorID}\n You do not own this tag`);
                } else {
                    if(!args[2]){
                        //no args error
                    } if(args[2] === "false"){
                sql.run(`UPDATE tags SET selfDelete = "false" WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);
                message.channel.send("This tag has been updated (cdel: false)");
                    } if(args[2] === "true"){
                        // same as above but "true"
                        sql.run(`UPDATE tags SET selfDelete = "true" WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);
                        message.channel.send("This tag has been updated (cdel: true)");
                    } else {
                        message.channel.send("Incorrect arguments: Please enter either true or false after the command");
                    }
            }
            }
        
    }*/
 else if(args[0] === "delete") {

    row = sql.get(`SELECT * FROM tags WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);

        console.log(row);
        if(!row){
            message.channel.send("A tag with this name does not exist");
        } else {
            var authorID = (message.author.id).toString();

            if(authorID !== row.ownerID){
                message.channel.send(`OwnerID: ${row.ownerID} \nAuthorID: ${authorID}\n You do not own this tag \nUse kk!t forcedelete if you are staff`);
            } else {
            sql.run(`DELETE FROM tags WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);
            message.channel.send("This tag has been deleted");
            }
        }

}else if(args[0] === "size"){

    if(!message.author.id === config.owner) return;
    
    row = sql.all(`SELECT ownerID FROM tags`);
    const embed = new Discord.MessageEmbed()
    .setTimestamp() //Write to JSON
    .setTitle("There are " + (row.length) + " tags stored")
    message.channel.send({embed});

}else if(args[0] === "list"){
    async function list(){
    let user = await client.users.fetch(message.author.id)
    .then(user => {
        // once promise returns with user, send user a DM
        row = sql.all(`SELECT tagName FROM tags WHERE serverId ="${message.guild.id}" AND ownerID = "${message.author.id}"`);
            
            if(!row) return message.channel.send("You have no tags");

            var contentVar = JSON.stringify(row, null, 2);
            //console.log(row.length);

            var messageVar = "";
            var messageArrayVar = [];

            if(row.length > 0){
            var i = 0;
            while(i < row.length){
                messageArrayVar[i] = row[i].tagName;
                messageVar = messageVar + row[i].tagName + "\n";
            contentVar.replace('{', '-');
            contentVar.replace("},", " ");
            contentVar.replace("\"tagName\":", " ");
            contentVar.replace("\"", " ");
            i = i + 1;
            }

        }else{
                messageVar = "You have no tags";
            }

            function chunkArray(myArray, chunk_size){
                var index = 0;
                var arrayLength = myArray.length;
                var tempArray = [];
                
                for (index = 0; index < arrayLength; index += chunk_size) {
                    myChunk = myArray.slice(index, index+chunk_size);
                    // Do something if you want with the group
                    tempArray.push(myChunk);
                }
            
                return tempArray;
            }

            // Split in group of 3 items
            messageArrayVar = chunkArray(messageArrayVar, 30);

             //console.log(messageArrayVar);

            var toSend = "**Tags [" + row.length + "]:**";
            var e = 0;
            //if(messageArrayVar.length = 0) tosend = "You have no tags.";

            user.send(toSend);

            console.log(messageArrayVar.length);

            while( e < messageArrayVar.length){
                user.send(messageArrayVar[e].join(', ')).catch((err) => {message.reply("please enable DMs")});
                e = e+1;
            }

             user.send();
             //user.send("**Tag list:**\n" + messageVar).catch((err) => {return message.channel.send("**An error occured, please enable DMs on this server**");});
    }).catch((err)=>{
		const embed = new Discord.MessageEmbed()
	.setColor(0xF46242)
	.setTimestamp() //Write to JSON
	.setTitle("Error sending list, please make sure you have DMs enabled")
	.setFooter(err)
	message.channel.send({embed});
    });
}
list().catch((err) => {message.reply(err)});

} else if(args[0] === "forcedelete") {
    if(!message.member.permissions.has('KICK_MEMBERS')){
        message.channel.send("This requires KICK_MEMBERS");
    } else {
        row = sql.get(`SELECT * FROM tags WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);

            console.log(row);
            if(!row){
                message.channel.send("A tag with this name does not exist");
            } else {
                var authorID = (message.author.id).toString();

                sql.run(`DELETE FROM tags WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);
                message.channel.send("This tag has been deleted");
                
            }
    }
} else if(args[0] === "eval"){

    try{
    var taggerContent = args.slice(1).join(' ');
    var t = await tag.read(taggerContent,message,args);
    message.channel.send(t);
    } catch(err){
        console.log(err);
    }

} else if(args[0] === "raw"){
    row = sql.get(`SELECT * FROM tags WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);

        if(!row) return message.channel.send("There are no tags with that name")

        message.channel.send(row.tagContent).catch((err) => {
            row.tagContent
        });

} else if(args[0] === "info" || args[0] === "owner"){
    row  = sql.get(`SELECT * FROM tags WHERE serverId ="${message.guild.id}" AND tagName = "${args[1].toLowerCase()}"`);
        if(!row){
            message.channel.send("The tag name you gave me is invalid");
        } else {
            async function EmbedF(){

            var userOwnerID = await client.fetchUser(row.ownerID);
            
            if(!userOwnerID){
            var ownerName = "Owner Not in Guild";
            var ownerAvy = "https://kitk.us/image/discord.png";
            } else {
            var ownerName = userOwnerID.tag;
            var ownerAvy = userOwnerID.avatarURL;           
            }

            if(row.tagContent.length > 170){
                var rowContent = "Too long to embed"
            } else {
                var rowContent = row.tagContent;
            }

            const embed = new Discord.MessageEmbed()
            .setTimestamp() //Write to JSON
            .setTitle("Tag info")
            .addField("Owner", ownerName)
            .addField("Name",row.tagName)
            .addField("Content",rowContent)
            .setThumbnail(ownerAvy)
          message.channel.send({embed});
            }
            EmbedF();
        }

    } else {
    var row = await sql.get(`SELECT * FROM tags WHERE serverId ="${message.guild.id}" AND tagName = "${args[0].toLowerCase()}"`);
        if(!row){
            message.channel.send("A tag with this name does not exist");
        } else {
            try{
            var t = await tag.read(row.tagContent,message,args);
            message.channel.send(t);
            } catch(err){
            console.log(err);
            }
        }
}

  }
  
  exports.conf = {
    help: "Create, destroy or edit a tag - For more information on how to structure a tag, click [here](https://github.com/2tuu/Kit/blob/master/docs/tags.md)",
    format: "k?tag [tag-name/create/edit/delete/search/random]",
    DM: false,
    OwnerOnly: false,
    alias: ['t']
}
