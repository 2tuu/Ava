
exports.run = (client, message, args) => {
	var chan = client.channels.find('id', args[0]);
	chan.send(args.slice(1).join(' '));
}

exports.conf = {
    category: "Admin",
    name: "N/A (dev command)",
    help: "N/A",
    format: "N/A",
    DM: true,
    OwnerOnly: true,
    alias: []
}