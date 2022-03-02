exports.run = (client, message, args) => {

    if(args[0] === "toc"){
        if(args[1] === "f"){
        result = Math.round((args[2] -32) * 0.555);
        client.messageHandler(message, client.isInteraction, args[2] + "°F is " + result + "°C")
        } else if(args[1] === "k"){
            result = Math.round(args[2] - 273.15);
        client.messageHandler(message, client.isInteraction, args[2] + "K is " + result + "°C")
        } else if(args[1] === "c"){
        client.messageHandler(message, client.isInteraction, "What are you trying to accomplish?")
        } else {
            client.messageHandler(message, client.isInteraction, "Invalid structure (ie. k?temp toc f 100)")
        }
    } else if(args[0] === "tok"){
        if(args[1] === "c"){
            result = Math.round(parseInt(args[2]) + 273.15);
            client.messageHandler(message, client.isInteraction, args[2] + "°C is " + result + "K")
        } else if(args[1] === "f"){
            result = Math.round(((args[2] -32) * 0.555) + 273.15);
        client.messageHandler(message, client.isInteraction, args[2] + "°F is " + result + "K")
        } else if(args[1] === "k"){
            client.messageHandler(message, client.isInteraction, "What are you trying to accomplish?")
        } else {
            client.messageHandler(message, client.isInteraction, "Invalid structure (ie. k?temp toc f 100)")
        }
    } else if(args[0] === "tof"){
        if(args[1] === "c"){
            result = Math.round(args[2] * (9/5) + 32);
            client.messageHandler(message, client.isInteraction, args[2] + "°C is " + result + "°F")
            } else if(args[1] === "k"){
                result = Math.round((9/5) * (args[2] - 273.15) + 32);
            client.messageHandler(message, client.isInteraction, args[2] + "K is " + result + "°F")
            } else if(args[1] === "f"){
                client.messageHandler(message, client.isInteraction, "What are you trying to accomplish?")
            } else {
                client.messageHandler(message, client.isInteraction, "Invalid structure (ie. k?temp toc f 100)")
            }
    } else {
        client.messageHandler(message, client.isInteraction, "Invalid arguments");
    }

}

exports.conf = {
    category: "Fun",
    name: "Temp",
    help: "Convert Kelvin/Celsuis/Fahrenheit to any of those three",
    shortHelp: "Convert temperatures",
    format: "k?temp [toc/tof/tok] [f/k/c]",
    DM: true,
    ownerOnly: false,
    alias: ['temperature'],
  slashCommand: true,
  data:{
          name: 'temp',
          description: 'Convert temperatures',
          options: [
              {
                  choices: [
                      { name: 'to-celcius', value: 'toc' },
                      { name: 'to-fahrenheit', value: 'tof' },
                      { name: 'to-kelvin', value: 'tok' }
                  ],
                  autocomplete: undefined,
                  type: 3,
                  name: 'starting-temp',
                  description: 'The temperature to translate from',
                  required: true
              },
              {
                choices: [
                    { name: 'from-celcius', value: 'c' },
                    { name: 'from-fahrenheit', value: 'f' },
                    { name: 'from-kelvin', value: 'k' }
                ],
                autocomplete: undefined,
                type: 3,
                name: 'to-temp',
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