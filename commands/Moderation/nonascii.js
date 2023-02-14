//run yadda yada
var latinize = require('latinize');
var unidecode = require('unidecode');

exports.run = (client, message, args) => {

	if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .addField("Description", client.help['nonascii'].help)
            .addField("Usage", '```' + client.help['mute'].format + '```')
        return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

	if(!message.member.permissions.has('MANAGE_NICKNAMES')){
		return message.reply("Sorry, you don't have permission to use this.");
	}


	var argVar = args[0].replace("<@", "").replace("!", "").replace(">", "");
	var member = message.member.guild.members.cache.get(argVar);

	if(!member){
		return message.reply("Please mention a valid user, or use their ID");
	} else {
		try{
			var uName = member.user.username;
				  uName = latinize(uName);
				  uName = unidecode(uName);
			
			member.setNickname(uName);
			message.reply(`The user's nickname has been set to: ${uName}`);
		} catch(err) {
			return message.reply("I was unable to change this user's nickname, please check my permissions");
		}
	}

}

exports.conf = {
    name: "Nonascii",
    help: "Remove non-ascii characters from a nickname",
    format: "k?nonascii [@user]\nk?nonascii [User ID]",
    DM: false,
    ownerOnly: false,
    alias: ['decancer'],
    slashCommand: false
}