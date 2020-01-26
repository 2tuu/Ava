const yt = require('ytdl-core');
const tokens = require('./../config.json');
const config = require('./../config.json');

var search = require('youtube-search');

/*

WORK-IN-PROGRESS

Patched from OhGodMusicBot Version 11
Changed to work with d.js 11 (replaced sendMessage)
Matching command handler to work with Kit

Original Framework Credit: bdistin

*/

exports.run = (client, message, args, deletedMessage, sql, tossedSet, roles, queue) => {
    
    //Prefix grabber for
    sql.get(`SELECT * FROM prefixes WHERE serverId ="${message.guild.id}"`).then(row => {

    var msg = message; //kab's lazy

//Args handler
if(args[0] === "play"){
    if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with k?music add`);
		if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
		//if (queue[msg.guild.id].playing) return msg.channel.sendMessage('Already Playing');
		let dispatcher;
		queue[msg.guild.id].playing = true;

		console.log(queue);
		(function play(song) {
			console.log(song);
			if (song === undefined) return msg.channel.sendMessage('Queue is empty').then(() => {
				queue[msg.guild.id].playing = false;
				msg.member.voiceChannel.leave();
			});
			msg.channel.sendMessage(`Playing: **${song.title}** as requested by: **${song.requester}**`);
			dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : tokens.passes });
			let collector = msg.channel.createCollector(m => m);
			collector.on('message', m => {

                var customPrefix = row.prefix;
                var botMention = "<@" + client.user.id + ">";
                var botMentionX = "<@!" + client.user.id + ">";
              
                //Command handler
                if(m.guild){
                if((m.content.indexOf(config.prefix) !== 0) && 
                   (m.content.indexOf(customPrefix) !== 0) &&
                    (m.content.indexOf(botMention) !== 0) &&
                      (m.content.indexOf(botMentionX)))  return;
                }
                
                var args = m.content.slice(config.prefix.length).trim().split(/ +/g);
                var command = args.shift().toLowerCase();
                
                if(m.content.startsWith(customPrefix)){
                pLength = customPrefix.length;
                args = m.content.slice(customPrefix.length).trim().split(/ +/g);
                command = args.shift().toLowerCase();
                }
              
                if(m.content.startsWith(botMention)){
                  pLength = botMention.length;
                  args = m.content.slice(botMention.length).trim().split(/ +/g);
                  command = args.shift().toLowerCase();
                  }
              
                  if(m.content.startsWith(botMentionX)){
                    pLength = botMentionX.length;
                    args = m.content.slice(botMentionX.length).trim().split(/ +/g);
                    command = args.shift().toLowerCase();
                    }

                    //whee if-statement command handler

                    if (command === "pause") {
                        msg.channel.send('paused').then(() => {dispatcher.pause();});
                    } else if (command === "resume"){
                        msg.channel.send('resumed').then(() => {dispatcher.resume();});
                    } else if (command === "skip"){
                        msg.channel.send('skipped').then(() => {dispatcher.end();});
                    } else if (command === "time"){
                        msg.channel.send(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
                    } else if (command === "volume"){
                        if(!args[0]){
                            msg.channel.send(`Current voluem: ${dispatcher.volume}`)
                        } else {
                            if(isNaN(args[0]) ){

                            } else {
                                msg.channel.sendMessage(`Volume: ${dispatcher.volume}`);
                                dispatcher.setVolume(args[0]);
                                msg.channel.sendMessage(`Volume: ${dispatcher.volume}`);
                            }
                        }
                       
                    }

                    /*
				if (m.content === "kit?music pause") {
					msg.channel.sendMessage('paused').then(() => {dispatcher.pause();});
				} else if (m.content === "kit?music resume"){
					msg.channel.sendMessage('resumed').then(() => {dispatcher.resume();});
				} else if (m.content === "kit?music skip"){
					msg.channel.sendMessage('skipped').then(() => {dispatcher.end();});
				} else if (m.content === "kit?music pause"){
					msg.channel.sendMessage(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
                }
                */
                

			});
			dispatcher.on('end', () => {
				collector.stop();
				play(queue[msg.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return msg.channel.sendMessage('error: ' + err).then(() => {
					collector.stop();
					play(queue[msg.guild.id].songs.shift());
				});
			});
        })(queue[msg.guild.id].songs.shift());
        

} else if(args[0] === "join"){
    return new Promise((resolve, reject) => {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
        voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
    });
} else if(args[0] ==="add"){

    var term = args.slice(1).join(' ');
    var opts = {
      maxResults: 1,
      key: config.youtube //Youtube API key
    };

    search(term, opts, function(err, results) {
        if(err) return console.log(err);
          
      if(!results[0]){
      return message.channel.send("A video with this name was not found.");
      } else {
        var videoResult = JSON.stringify(results[0].link);
        videoResult = videoResult.replace('"',"");
        videoResult = videoResult.replace('"',"");
        //console.log("RESULT " + videoResult);


        let url = videoResult;
		if (url == '' || url === undefined) return msg.channel.sendMessage(`You must add a YouTube video url, or id after k?music add`);
		yt.getInfo(url, (err, info) => {
			if(err) return msg.channel.sendMessage('Invalid YouTube Link: ' + err);
			if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
			queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username, requesterId: msg.author.id});
			msg.channel.sendMessage(`added **${info.title}** to the queue`);
		});
      }
      });



} else if(args[0] === "queue"){

    if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with k?music add`);
    let tosend = [];
    queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
    msg.channel.sendMessage(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);

}

});

}

exports.conf = {
    DM: true,
    OwnerOnly: false,
    alias: []
}