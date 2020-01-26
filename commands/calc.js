var scalc = require('scalc');
exports.run = (client, message, args) => {

    try{

    if(!args[0]){
        message.channel.send('No arguments');
    } else {
        var result = scalc(args.join(' '));

        if(!result) return message.channel.send('An error occured');

        message.channel.send('Result: `' + result + '`');
    }

    } catch(err){
        message.channel.send('An error occured: `' + err + '`');
    }

}

exports.conf = {
    DM: true,
    OwnerOnly: false
}