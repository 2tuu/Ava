exports.run = (client, message) => {
  setTimeout(() => {
    client.messageHandler(message, client.isInteraction, "boop");
  setTimeout(() => {
    client.messageHandler(message, client.isInteraction, "meow");
  }, 3000);
  }, 1000);
}

exports.conf = {
  category: "Fun",
  name: "Beep",
  help: "boop",
  shortHelp: "meow",
  format: "meow",
  DM: true,
  ownerOnly: true, //fix edit behavior
  alias: []
}