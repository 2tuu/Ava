const responses = [
  "Yes",
  "I'm not sure",
  "Ask again later",
  "No",
  "Definitely not",
  "Definitely",
  "Maybe",
  "I don't know",
  "Perhaps",
  "What?"
];

exports.run = (client, message, args) => {
  var response = responses[Math.floor(Math.random() * responses.length)];
  client.messageHandler(message, client.isInteraction, response)
}

exports.conf = {
  name: "8ball",
  help: "Ask a yes or no question and get a response",
  format: "k?8ball [question]",
  DM: false,
  ownerOnly: false,
  alias: ["am", "are", "is", "can", "do", "will", "does", "would"],
  slashCommand: true,
  data: {
    name: "8ball",
    description: "Magic 8-ball",
    options: [
      {
        choices: undefined,
        autocomplete: undefined,
        type: 3,
        name: 'question',
        description: 'What will you ask?',
        required: false
      }
    ],
    dm_permission: false
  }
}