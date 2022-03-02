exports.run = (client, message) => {
  setTimeout(() => {
    client.messageHandler(message, client.isInteraction, "boop");
    setTimeout(() => {
      client.messageHandler(message, client.isInteraction, "meow", true);
    }, 3000);
  }, 1000);
}

exports.conf = {
  category: "Fun",
  name: "Beep",
  help: "boop",
  format: "meow",
  DM: true,
  ownerOnly: false,
  alias: [],
  slashCommand: true,
  data: {
    name: "beep",
    description: "meow",
    options: [],
    default_permission: undefined
  }
}