const Discord = require('discord.js');

exports.run = (client, message, args) => {
    const embed = new Discord.RichEmbed()
    .setColor(0xF46242)
    .setDescription("**Announcements:**\n\n" +
    "It was fun while it lasted, but Kit will be going down permanently in the coming days\nI don't have enough time or motivation to keep working on this project, and with incredibly declined activity, and the lacking demand for Discord bots nowadays, that added with the toxic environment the development communities brew, I've decided to stop development\nThe bot will likely remain up until the code is revised to a working state, at which time I'll be uploading everything to GitHub and shutting the bot down, as well as Kit's sister-bot\n\nThank you to the few who've supported me along the way, it's been fun for the most part\n\n-Max")
    message.channel.send({embed});
}

exports.conf = {
    DM: true,
    OwnerOnly: false
}
