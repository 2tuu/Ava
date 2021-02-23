const Discord = require("discord.js");

exports.run = (client, message, args) => {

    var commandList = Object.keys(client.aliases);
    
    if(!args[0]){

        const embed = new Discord.MessageEmbed()
        .setTitle("Command documentation")
        .setDescription("Use this command to view what a command does\n\nArguments surrounded by [] are required, ones surrounded by {} are optional\n")
        .addField('Commands', '```' + commandList.join(', ') + '```')
        message.channel.send({embed});

    } else if(commandList.includes(args[0].toLowerCase())){

        const embed = new Discord.MessageEmbed()
        .setTitle("Command documentation")
        .addField("Description", client.help[args[0].toLowerCase()].help)
        .addField("Usage", '```' + client.help[args[0].toLowerCase()].format + '```')
        message.channel.send({embed});
        
    } else {
        return message.channel.send("That's not a command, try again");
    }

}

exports.conf = {
    help: "Why do you need help with this one?",
    format: "k?help [command]",
    DM: true,
    OwnerOnly: false,
    alias: []
}
