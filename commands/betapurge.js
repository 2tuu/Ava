/*
TODO:

1. Use switch/case instead of if/else
2. Remember bulkDelete(message-collection, true)<-
3. While-loop delete on bunches above 50 to prevent error
*/

exports.run = (client, message, args) => {

    var option;

    if(args[0]){
        option = args[0].toLowerCase();
    } else {
        //no args warning
        return;
    }

    async function fetchBlock(option, count){
        /*
        var channel = await message.guild.channels.fetch(message.channel.id);
        var messageBlock = channel.messages;
        var messages = await messageBlock.fetch({ limit: 10 });
        */
        var channel = await message.guild.channels.get(message.channel.id);
        channel.awaitMessages
        message.channel.send(`${messages.size}`);
    }


    //Options
    switch(option){
        case 'bots':
            //purge recent bots
            console.log('bots');
            break;
        case 'test':
            fetchBlock();
            break;
    }

}

exports.conf = {
    category: "In Development",
    name: "N/A (dev command)",
    help: "Purge a bunch of messages, of a number, from a specific user, bots, or as many as the bot can",
    format: "k?purge [all/u [ID]/bots/#]",
    DM: true,
    OwnerOnly: true,
    alias: []
}