const ySearch = require('yt-search');
const Discord = require("discord.js");

exports.run = (client, message, args) => {
  var searchTerms;

  if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['youtube'].help)
			.addField("Usage", '```' + client.help['youtube'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}

  searchTerms = args.join(' ');

  ySearch(searchTerms, function (err, r) {
    if (err) return client.messageHandler(message, client.isInteraction, 'An error occured:\n```js' + err + '```');

    const videos = r.videos

    if (videos[0]) {
      var v = videos[0];
      const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setTitle(`**${v.title}**`)
      if (!client.isInteraction) {
        client.messageHandler(message, client.isInteraction, { embeds: [embed] });
      }
      client.messageHandler(message, client.isInteraction, `${v.url}`);
    } else {
      client.messageHandler(message, client.isInteraction, 'No results.');
    }
  });
}

exports.conf = {
  name: "Youtube",
  help: "Search youtube for something",
  format: "k?youtube [search-terms]",
  DM: true,
  ownerOnly: false,
  alias: ['yt'],
  slashCommand: true,
  data: {
    name: "youtube",
    description: "Search youtube for a video",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'terms',
        description: 'Search terms',
        required: true
      }
    ],
    default_permission: undefined
  }
}