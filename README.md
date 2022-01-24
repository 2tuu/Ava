## This project is not yet prepared to be installed by anyone else, once I have completed the installation scripts this message will be removed. Until then, only install this if you know what you're doing.
## In addition, this project is not finished, and will likely not be updated frequently.


## Bot
Ava is a general use moderation bot with a bunch of fun commands - She's built in Node JS with Discord.js, currently running in version v14.16.1


## Initial Configuration
Warning: Before running the script, please fill out `config.example.json` with the proper information, and rename it `config.json`
The install script is a work in progress, and may not work properly

Additionally, the bot is only designed to work with a postgresql database, make sure it is installed, set up and it's credentials are entered into `config.json` before setting up

After filling out config.json, run `install.sh` - While these installation scripts are not designed to be used on windows, the bot itself should still work with manual setup (make sure you know what you're doing)

To install all node dependencies, run `npm i` while in the main folder, and it should install everything on it's own

Once everything is configured, just run `app.js` with node (to keep it from staying closed if it crashes or stops, use a program like pm2 to run it)


## Command Structure
All commands are automatically loaded from the /commands/ folder, and must be formatted like this:
```js
/*
possible options are; client, message, args, deletedMessage, pool, tossedSet, roles

must be used in that order

variables:
client - client variable, includes the client's information, user attached to client, etc.
message - the object of the message that triggered the command
args - the words following the command, seperated into an array (ie. '!help word1 word2 word3' would result in ['word1','word2','word3'])
*/
exports.run = (client, message, args) => {
    //code to be run on command execution here
}

exports.conf = {
    category: "Fun",
    //the category for the command to be placed in for the k?help command
    name: "Command",
    //the name of the command to be placed in the help command, and logged in the usage list
    help: "What the command does",
    //a description of what the command does
    format: "k?command [argument]",
    //a brief summary of how the command should be used
    DM: true,
    //can this command be used in DMs?
    OwnerOnly: false,
    //can this command only be used by devs?
    alias: ["command1", "command2"]
    //aliases for the command (ie. this command will respond to 'k?command1' and 'k?command2' as well as it's own name)
}
```


## Event Structure
Event files are automatically loaded on their associated events (ie. an event named `message.js` will be triggered on the message event) from the /events/ folder, and must be formatted like this:
```js
//imports depend on which event is being used (refer to the discord.js documentation), this example in particular is the message event
//(async is optional)
exports.run = async (deletedMessage, pool, client, message) => {
    //code to be run on message event
}

```