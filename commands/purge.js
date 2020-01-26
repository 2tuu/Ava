exports.run = (client, message, args) => {

    if(args[0] === "bots"){
        async function purge(){
            if(!message.member.permissions.has('MANAGE_MESSAGES')){
        
            return message.reply("Sorry, you don't have permission to use this.");
            }
        
          var deleteCount = parseInt(args[1], 10);
          deleteCount = deleteCount + 7;
          
          message.channel.fetchMessages().then(messages => {
            const botMessages = messages.filter(msg => msg.author.bot);
            message.channel.bulkDelete(botMessages).catch((err) => {message.channel.send("Error: " + err);} );
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
    message.channel.bulkDelete(botMessages).catch((err) => {message.channel.send("Error: " + err);} );
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
        
            message.channel.bulkDelete(botMessages).catch(error => message.channel.send(`Couldn't delete messages because of: ${error}`));
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
// This command removes all messages from all users in the channel, up to 100.
  
  // get the delete count, as an actual number.
  var deleteCount = parseInt(args[0], 10);
  
  // Ooooh nice, combined conditions. <3
  if(!deleteCount || deleteCount < 0 /*|| deleteCount > 100*/){
    return message.reply("Please provide a number between 2 and 100 for the number of messages to delete (" + parseInt(args[0], 10) + ")");
  }

  // So we get our messages, and delete them. Simple enough, right?
  const fetched = await message.channel.fetchMessages({count: deleteCount});
  //console.log(fetched);
  // fetched = fetched - 20;

  deleteCount = deleteCount + 1;

  while(deleteCount > 100){
    message.channel.bulkDelete(100);
    deleteCount = deleteCount - 100;
  }
  message.channel.bulkDelete(deleteCount)
.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
    purge();
}

}

exports.conf = {
  DM: true,
  OwnerOnly: false,
  alias: []
}