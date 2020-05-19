 ## Note
This project is no longer in active development, updates may come slowly unless there's an issue. If you'd like to make a contribution you are free to. If you'd still like to host your own copy, the repo still needs to be updated to better support that; as of May 18th, 2020, the main bot is still up and running.
 
## Inviting the public version
The bot is still running and can be invited with [this link](https://discord.com/api/oauth2/authorize?client_id=435855803363360779&permissions=1544416470&scope=bot). Changing the permissions integer is not recommended, as it can cause errors in the bot.
 
## Documentation
Command documentation is available within the `k?help` command, bot programming documentation is still in progress.

## Command Aliases
Some commands have aliases, they are included in the conf export at the end of every command
When entere, they should look like this;
**Aliases:**

```js
exports.conf = {
    DM: true,
    OwnerOnly: false,
    alias: ['alias1', 'alias2', 'alias3']
}
```

