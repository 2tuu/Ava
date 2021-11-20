const Discord = require('discord.js');

//TODO: reformat for new lib
exports.run = (client, message, args) => {

    async function fetchM(id, ch){

        if(!id) return;

        ch = ch.replace("<#", "").replace(">", "");

        console.log(ch);

        var chan = message.guild.channels.cache.get(ch);
        var mVar = await chan.messages.cache.get(id);
    
        if(!mVar){
            //no message found
            const embed = new Discord.MessageEmbed()
            .setColor(0xF46242)
            .setDescription("No message found")
            return message.channel.send({embed});
        } else {
            const embed = new Discord.MessageEmbed()
            .setAuthor(mVar.author.username, mVar.author.avatarURL)
            .setDescription(mVar.content)
            return message.channel.send({embed});
        }

    }

    if(!args[1]){
        var firstArg = args[0];
        var secondArg = message.channel.id;
    } else {
        var firstArg = args[0];
        var secondArg = args[1];
    }

    fetchM(firstArg, secondArg).catch((err) => {
        //no message found
        const embed = new Discord.MessageEmbed()
        .setColor(0xF46242)
        .setDescription("No message found")
        .setFooter(err)
        return message.channel.send({embed});
    });

}

exports.conf = {
    category: "Utility",
    name: "Quote",
    help: "Quote a message from this channel, or another if specified",
    format: "k?quote {optional: #channel} [Message ID]",
    DM: false,
    OwnerOnly: true,
    alias: []
}