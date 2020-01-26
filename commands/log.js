const config = require("./../config.json");

exports.run = (client, message, args) => {

    if(!message.author.id === config.owner);
    console.log(">>> " + args.join(' '));

    client.channels.find('id', config.logChannel).send("```js\n>>> '" + args.join(' ') + "'\n```")

}

exports.conf = {
    DM: true,
    OwnerOnly: false
}