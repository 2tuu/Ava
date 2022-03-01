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
    var response = responses[Math.floor(Math.random()*responses.length)];
    client.messageHandler(message, client.isInteraction, response)
}

exports.conf = {
    category: "Fun",
    name: "8ball",
    help: "Ask a yes or no question and get a response",
    shortHelp: "Answers yes/no questions",
    format: "k?8ball [question]",
    DM: true,
    ownerOnly: false,
    alias: ["am", "are", "is", "can", "do", "will", "does"],
    slashCommand: true
}