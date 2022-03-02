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
  category: "Fun",
  name: "8ball",
  help: "Ask a yes or no question and get a response",
  format: "k?8ball [question]",
  DM: true,
  ownerOnly: false,
  alias: ["am", "are", "is", "can", "do", "will", "does"],
  slashCommand: true,
  data: {
    name: "8ball",
    description: "Answers yes or no questions",
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
    default_permission: undefined
  }
}