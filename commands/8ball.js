const responses = ["Yes", "I'm not sure", "Ask again later", "No", "Definitely not", "Definitely", "Maybe"];

exports.run = (client, message, args) => {
    var response = responses[Math.floor(Math.random()*responses.length)];
    message.channel.send(response).then().catch(console.error);
}

exports.conf = {
    DM: true,
    OwnerOnly: false,
    alias: ["am", "are", "is", "can", "do", "will"]
}