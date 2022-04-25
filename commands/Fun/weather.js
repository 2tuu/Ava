const weather = require('weather-js');
const Discord = require("discord.js");

const weatheredRecently = new Set();

exports.run = (client, message, args) => {

  if(!args[0]){
		const embed = new Discord.MessageEmbed()
			.addField("Description", client.help['weather'].help)
			.addField("Usage", '```' + client.help['weather'].format + '```')
		return client.messageHandler(message, client.isInteraction, { embeds: [embed] });
	}


  if (weatheredRecently.has(message.author.id)) {
    return message.reply("Please wait 20 seconds before using that command again");
  } else {
    weatheredRecently.add(message.author.id);
    setTimeout(() => {
      weatheredRecently.delete(message.author.id);
    }, 20000);
  }

  weather.find({ search: args.join(' '), degreeType: 'F' }, function (err, result) {
    try {
      var info = result[0];
      var windSpeed = info.current.windspeed;
      var windSpeedRaw = windSpeed.replace("mph", "");

      var windDirection = info.current.winddisplay;
      var windDirectionRaw = windDirection.replace(windSpeedRaw, "");
      var windDirectionRawVar = windDirection.replace("mph", "");
      var windDirectionRaw = windDirectionRawVar.replace(windSpeedRaw, "");

      const embed = new Discord.MessageEmbed()

      client.messageHandler(message, client.isInteraction,
        {
          embeds: [{
            title: "Weather information for " + info.location.name,
            "footer": {
              "icon_url": "https://2tu.dev/kit/images/micro.png",
              "text": "Powered by MSN Weather"
            },
            "thumbnail": {
              "url": info.current.imageUrl
            },
            fields: [
              { name: "Weather Stats", value: "Temp: " + info.current.temperature + "°F • " + (Math.ceil(((info.current.temperature - 32) * (0.5556)) / 1) * 1) + "°C" + "\nFeels like: " + info.current.feelslike + "°F • " + (Math.ceil(((info.current.feelslike - 32) * (0.5556)) / 1) * 1) + "°C\n" + "Humidity: " + info.current.humidity + "%", inline: true },
              { name: "Wind", value: windSpeedRaw + "mph • " + (Math.ceil((windSpeedRaw) * 1.61) * 1) + " km/h\n" + "Direction: " + windDirectionRaw, inline: true }]
          }
          ]
        });
    }
    catch (err) {
      const embed = new Discord.MessageEmbed()
        .setColor(`0x${client.colors.bad}`)
        .setTitle("This search turned up blank")
      client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }
  });
}

exports.conf = {
  name: "Weather",
  help: "View the weather based on city",
  format: "k?weather [city]",
  DM: false,
  ownerOnly: false,
  alias: [],
  slashCommand: true,
  data: {
    name: "weather",
    description: "Weather",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'location',
        description: 'The location to search for',
        required: true
      }
    ],
    default_permission: undefined
  }
}