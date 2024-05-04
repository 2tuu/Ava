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
  "What?",
  "The stars say maybe",
  "Maybe?",
  "Perhaps",
  "no"
];

exports.run = (client, message, args) => {
  if (message.content.toLowerCase().includes('am i')) {
    if(Math.floor(Math.random() * 2) === 1){
      var response = "I don't know, are you?"
    } else {
      var response = responses[Math.floor(Math.random() * responses.length)];
    }
  } else {
    var response = responses[Math.floor(Math.random() * responses.length)];
  }
  
  client.messageHandler(message, client.isInteraction, response)
}

exports.conf = {
  name: "8ball",
  help: "Ask a yes or no question and get a response",
  format: "k?8ball [question]",
  DM: false,
  ownerOnly: false,
  alias: ["should", "am", "are", "is", "can", "do", "will", "does", "would", "did"],
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