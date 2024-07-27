## This repository is no longer maintained
## Kit
Kit is a general use moderation bot with a bunch of fun commands - She's built in Node JS with Discord.js, currently running in version v16.14.0


## Docs
 - [Latest Announcement](https://github.com/nogegg/Kit/blob/master/docs/news.md)
 - [Privacy Policy](https://github.com/nogegg/Kit/blob/master/docs/privacy.md)
 - [Terms of Service](https://github.com/nogegg/Kit/blob/master/docs/tos.md)
 - [How to Set Me Up](https://github.com/nogegg/Kit/blob/master/docs/setup.md)
 - [Tag Documentation](https://github.com/nogegg/Kit/blob/master/docs/tags.md)

## Before Using
Kit is not designed to be installed or used by anyone but me, as such I haven't really made any sort of functioning or documented installation script, nor will I in the future

I will not be providing support in installing this yourself outside of the information stated below, the rest is for you


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
    name: "Command",
    //Name of the command - only gets used for the simple statistics
    help: "This is what the command does",
    //Summary that appears in the help command
    format: "k?command [argument]",
    //Usage instructions for the help command
    DM: false,
    //Toggles ability to use the command in DMs
    ownerOnly: false,
    //Marks the command to only be used by the bot owner
    alias: ["command1", "command2"],
    //Aliases for the command to respond to (ie. 'k?command', 'k?command1' and 'k?command2' will all trigger this command)
    slashCommand: true,
    //Whether or not the command is designed to be a slash command (The 'data' block is not required if this is set to false)
    data: {
        name: 'command',
        description: 'Short summary',
        options: [
            {
                choices: [
                    { name: 'first option', value: 'first' },
                    { name: 'second option', value: 'second' },
                    { name: 'third option', value: 'third' }
                ],
                autocomplete: undefined,
                type: 3,
                name: 'option', /* lowercase */
                description: 'Description of the required option',
                required: true
            },
            {
                choices: undefined,
                autocomplete: false,
                type: 3,
                name: 'second-option', /* no spaces */
                description: 'Description of the second optional option',
                required: false
            }
        ],
        default_permission: undefined
    }
    //The data to be sent to the discord API for the slash command
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
