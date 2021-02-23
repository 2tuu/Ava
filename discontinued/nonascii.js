//run yadda yada
const accents = require('remove-accents');
var latinize = require('latinize');
var unidecode = require('unidecode');

exports.run = (client, message, args) => {
	try{
if(!args[0]) return message.channel.send("No arguments were given");

	if(!message.mentions.users.first()){
	var str = args.join(' ');
	} else {
	var usr = message.mentions.users.first();
	var str = usr.username;
	}

	if(!str) return message.channel.send("The given string was empty");
	str = accents.remove(str);
	str = latinize(str);
	str = unidecode(str);

	if(str.length == 0){str = "Cancer";}

	message.channel.send("`ASCII:` " + str);

	if(message.mentions.users.first()){

		var usr = message.mentions.users.first();
		usr = message.guild.members.get(usr.id);

	if(message.member.permissions.has('MANAGE_NICKNAMES')){
		//usr.setNickname(str, "Decancered").catch((err)=>{});
	}
	}
}
catch (err){
	console.log(err);
}
}

exports.conf = {
    help: "Remove non-ascii characters from a piece of text, or a nickname",
    format: "k?nonascii [text/@user]",
    DM: false,
    OwnerOnly: true, //TODO: fix the nickname changer
    alias: ['decancer']
}