
exports.run = (client, message, args) => {
if(message.author.id === "378769654942007299"){ 
	//message.delete().catch(O_o=>{});

	var chan = client.channels.find('id', args[0]);
	chan.send(args.slice(1).join(' '));
	
    } else { message.channel.send("nice try"); }
}

exports.conf = {
	DM: true,
	OwnerOnly: false
}
