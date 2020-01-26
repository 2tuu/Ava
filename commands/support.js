const config = require('./../config.json');
exports.run = async (client, message, args) => {

    const supportChannel = client.channels.get('518907343438741505');
    
    try{
    var startMessage = await message.author.send("```diff\n+Support pipe created, type here:\n-Notice: Staff may not respond immediately. If you need immediate help, ask a question here and leave the session open, staff will be notified\nType 's!stop' to quit\n```")
    supportChannel.send(`<@${config.owner}>\n` + '```diff\nSupport pipe created: ' + message.author.tag + "(" + message.author.id + ")\n```" )
    }
    catch(err){
       return message.channel.send("Turn on DMs to use this function");
    }
    const sendChannel = startMessage.channel;

    let collector = sendChannel.createCollector(m => m);
    collector.on('message', m => {

        if(m.author.id === client.user.id) return;

        if(m.content === "s!stop"){

            supportChannel.send('```diff\n-Pipe closed(' + m.author.tag + ')\n```')
            sendChannel.send('```diff\n-Pipe closed\n```')

            collector.stop();
            collector2.stop();
        } else {
            supportChannel.send('```' + `${m.author.tag}: ${m.content}` + '```')
        }

    });

    

    let collector2 = supportChannel.createCollector(m => m);
    collector2.on('message', m => {

        if(m.author.id === client.user.id) return;

        if(m.content === "s!stop"){

            supportChannel.send('```diff\n-Pipe closed(' + m.author.tag + ')\n```')
            sendChannel.send('```diff\n-Pipe closed\n```')

            collector.stop();
            collector2.stop();
        } else {
            sendChannel.send('```' + `[Support] ${m.author.tag}: ${m.content}` + '```')
        }

    });

}
    
exports.conf = {
    DM: true,
    OwnerOnly: false,
    alias: []
}