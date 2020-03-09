exports.run = (client, message, args) => {

    var option;

    if(args[0]){
        option = args[0].toLowerCase();
    } else {
        //no args warning
        return;
    }

    async function fetchBlock(option, count){
        var messages = await message.channel.messages.fetch({
            limit: 50,
          });
        console.log(messages.size);
    }

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
  help: "Purge a bunch of messages, of a number, from a specific user, bots, or as many as the bot can",
  format: "k?purge [all/u [ID]/bots/#]",
  DM: true,
  OwnerOnly: true,
  alias: []
}