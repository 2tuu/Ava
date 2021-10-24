//fixed for new framework
exports.run = (client, message, args) => {

    if(args[0] === "bots"){
        async function purge(){
            if(!message.member.permissions.has('MANAGE_MESSAGES')){
        
            return message.reply("Sorry, you don't have permission to use this.");
            }
        
          var deleteCount = parseInt(args[1], 10);
          deleteCount = deleteCount + 7;
          
          message.channel.messages.fetch({limit: deleteCount}).then(messages => {
            const botMessages = messages.filter(msg => msg.author.bot);
            message.channel.bulkDelete(botMessages, true).catch((err) => {message.channel.send("Error: " + err);} );
            messagesDeleted = botMessages.array().length; 
        
            message.channel.send('Deleted **' + messagesDeleted + '** bot messages')
        }).catch(err => {
            message.channel.send('Error: ' + err);
            //console.log(err);
        });
        
          }
            purge();
    } else if(args[0] === "all"){
        
  async function purge(){
    if(!message.member.permissions.has('MANAGE_MESSAGES')){

    return message.reply("Sorry, you don't have permission to use this.");
    }

  var deleteCount = parseInt(args[1], 10);
  deleteCount = deleteCount + 7;
  
  message.channel.fetchMessages().then(messages => {
    const botMessages = messages;
    message.channel.bulkDelete(botMessages, true).catch((err) => {message.channel.send("Error: " + err);} );
    messagesDeleted = botMessages.array().length; 

    message.channel.send('Deleted **' + messagesDeleted + '** messages')
}).catch(err => {
    message.channel.send('Error: ' + err);
    //console.log(err);
});

  }
    purge();

    } else if(args[0] === "user" || args[0] === "u"){

        async function purge(){
            if(!message.member.permissions.has('MANAGE_MESSAGES')){
        
            return message.reply("Sorry, you don't have permission to use this.");
            }
        
            if(!args[1]) return message.reply("Please give me a user ID");
          var userID = args[1].replace("<@", "").replace(">", "").replace('!', "");
          
          message.channel.fetchMessages().then(messages => {
            const botMessages = messages.filter(msg => msg.author.id === userID);
        
            message.channel.bulkDelete(botMessages, true).catch(error => message.channel.send(`Couldn't delete messages because of: ${error}`));
            messagesDeleted = botMessages.array().length; 
            
            message.channel.send('Deleted **' + messagesDeleted + '** messages from user id: '+ userID);
        }).catch(err => {
            message.channel.send('Error: ' + err + " **Please specify a valid user ID**");
            //console.log(err);
        });
        
          }
            purge();

    } else {

      async function purge(){
      if(!message.member.permissions.has('MANAGE_MESSAGES')){
        return message.reply("Sorry, you don't have permission to use this.");
      }

      var deleteCount = parseInt(args[0], 10);

      if(!deleteCount || deleteCount < 0 /*|| deleteCount > 100*/){
        return message.reply("Please provide a number between 2 and 100 for the number of messages to delete (" + parseInt(args[0], 10) + ")");
      }

      deleteCount = deleteCount + 1;

      while(deleteCount > 100){
        message.channel.bulkDelete(100, true);
        deleteCount = deleteCount - 100;
      }
      message.channel.bulkDelete(deleteCount, true)
      .catch(error => {
        return message.reply(`Couldn't delete messages because of: \`\`\`${error}\`\`\``);
      });
      }
      purge();
    }

}

exports.conf = {
  name: "Purge",
  help: "Purge a bunch of messages, of a number, from a specific user, bots, or up to 100\nThis only works on messages that're less than 2 weeks old",
  format: "k?purge [all/u [ID]/bots/#]",
  DM: true,
  OwnerOnly: false,
  alias: []
}