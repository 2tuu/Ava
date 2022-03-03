exports.run = (client, message, args) => {
  function reverseString(str) {
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return joinArray;
  }


  if (!args[0]) {
    client.messageHandler(message, client.isInteraction, "Field is blank");
  } else {
    client.messageHandler(message, client.isInteraction, reverseString(args.join(' ')));
  }

}

exports.conf = {
  name: "Reverse",
  help: "Reverse the given text",
  format: "k?reverse [text]",
  DM: true,
  ownerOnly: false,
  alias: [],
  slashCommand: true,
  data: {
    name: "reverse",
    description: "Reverse the given text",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'text',
        description: 'Text to reverse',
        required: true
      }
    ],
    default_permission: undefined
  }
}