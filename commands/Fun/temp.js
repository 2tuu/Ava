const Discord = require("discord.js");

exports.run = (client, message, args) => {

    if (args[0] === "toc") {
        if (args[1] === "f") {
            result = Math.round((args[2] - 32) * 0.555);
            client.messageHandler(message, client.isInteraction, args[2] + "°F is " + result + "°C")
        } else if (args[1] === "k") {
            result = Math.round(args[2] - 273.15);
            client.messageHandler(message, client.isInteraction, args[2] + "K is " + result + "°C")
        } else if (args[1] === "c") {
            const embed = new Discord.MessageEmbed()
            .setTitle("Can't translate Celcius to Celcius")
            .setColor(`0x${client.colors.bad}`)
          client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        } else {
            const embed = new Discord.MessageEmbed()
            .setTitle("Incorrect syntax (ie. k?temp toc f 100)")
            .setColor(`0x${client.colors.bad}`)
          client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }
    } else if (args[0] === "tok") {
        if (args[1] === "c") {
            result = Math.round(parseInt(args[2]) + 273.15);
            client.messageHandler(message, client.isInteraction, args[2] + "°C is " + result + "K")
        } else if (args[1] === "f") {
            result = Math.round(((args[2] - 32) * 0.555) + 273.15);
            client.messageHandler(message, client.isInteraction, args[2] + "°F is " + result + "K")
        } else if (args[1] === "k") {
            const embed = new Discord.MessageEmbed()
            .setTitle("Can't translate Kelvin to Kelvin")
            .setColor(`0x${client.colors.bad}`)
          client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        } else {
            const embed = new Discord.MessageEmbed()
            .setTitle("Incorrect syntax (ie. k?temp toc f 100)")
            .setColor(`0x${client.colors.bad}`)
          client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }
    } else if (args[0] === "tof") {
        if (args[1] === "c") {
            result = Math.round(args[2] * (9 / 5) + 32);
            client.messageHandler(message, client.isInteraction, args[2] + "°C is " + result + "°F")
        } else if (args[1] === "k") {
            result = Math.round((9 / 5) * (args[2] - 273.15) + 32);
            client.messageHandler(message, client.isInteraction, args[2] + "K is " + result + "°F")
        } else if (args[1] === "f") {
            const embed = new Discord.MessageEmbed()
            .setTitle("Can't translate Kelvin to Kelvin")
            .setColor(`0x${client.colors.bad}`)
          client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        } else {
            const embed = new Discord.MessageEmbed()
            .setTitle("Incorrect syntax (ie. k?temp toc f 100)")
            .setColor(`0x${client.colors.bad}`)
          client.messageHandler(message, client.isInteraction, { embeds: [embed] });
        }
    } else {
        const embed = new Discord.MessageEmbed()
        .setTitle("Invalid arguments")
        .setColor(`0x${client.colors.bad}`)
      client.messageHandler(message, client.isInteraction, { embeds: [embed] });
    }

}

exports.conf = {
    name: "Temp",
    help: "Convert Kelvin/Celsuis/Fahrenheit to any of those three",
    format: "k?temp [toc/tof/tok] [f/k/c]",
    DM: true,
    ownerOnly: false,
    alias: ['temperature'],
    slashCommand: true,
    data: {
        name: 'temp',
        description: 'Convert temperatures',
        options: [
            {
                choices: [
                    { name: 'celcius', value: 'toc' },
                    { name: 'fahrenheit', value: 'tof' },
                    { name: 'kelvin', value: 'tok' }
                ],
                autocomplete: undefined,
                type: 3,
                name: 'translate-from',
                description: 'The temperature to translate from',
                required: true
            },
            {
                choices: [
                    { name: 'celcius', value: 'c' },
                    { name: 'fahrenheit', value: 'f' },
                    { name: 'kelvin', value: 'k' }
                ],
                autocomplete: undefined,
                type: 3,
                name: 'translate-to',
                description: 'The temperature to translate to',
                required: true
            },
            {
                choices: undefined,
                autocomplete: undefined,
                type: 4,
                name: 'temperature',
                description: 'The temperature to translate',
                required: true
            }
        ],
        default_permission: undefined
    }
}