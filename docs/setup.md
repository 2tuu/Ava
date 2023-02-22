# Table of Contents
 1. [Inviting the Bot](#inviting-the-bot)
 2. [Setting Up Permissions](#setting-up-permissions)
    - Default permissions
    - Confirming permissions
 3. [Moderation functions](#moderation-functions)
    - Mute command and role orders
    - Mod log module
    - Server password
    - Welcome messages
4. [Bot Settings](#bot-settings)
    - Prefixes
5. [Other](#other)
    - Self-assignable roles
<br>

# Sidenote
Some of these commands are a little difficult to get through due to a number of options, and it may be easier to set them up using slash commands (especially the mod log)

<br>

# Inviting the Bot
The bot can be invited through it's profile on another server, or using the link below.
If the bot is already on your server and was invited before the introduction of slash commands, it can be given permission to load them by clicking the invite link in it's profile and inviting it again.

[Invite Link](https://discord.com/api/oauth2/authorize?client_id=435855803363360779&permissions=1514244795590&scope=bot%20applications.commands)

<br>

# Setting up permissions
Ideally you shouldn't have to change anything with the bot's permissions, it's default permissions are all it needs to function properly. The only exception to this is the position of it's role on the list; if you want Kit to be able to assign other users roles, or use the Mute function, it's highest role must be higher in the role list than the mute and/or custom roles

## Default Permissions
Kit's default permissions and their uses are listed below:

    - Manage Roles          <- Assign custom roles or add/remove the Muted role
    - Kick/Ban Members      <- Self explanatory, required for kick/ban commands to work
    - View Audit Log        <- Used to differentiate between kicks, normal leaves or bans in the mod log
    - Read Messages         <- Text command detection (not required for slash commands, but will break message logging in modlog)
    - Moderate Members      <- Generic permission for message deletion, and eventually time-outs
    - Send Messages         <- Required for replies
    - Manage Messages       <- Used for mass message deletions
    - Embed Links           <- Required for embed command replies
    - Attach Files          <- Required for long tag outputs and mass message deletion logs
    - Read Message History  <- Will help the bot cache recently active users when it restarts
    - Use App Commands      <- Required for slash command functionality (will be missing if it was invited before they were added)

## Confirming Permissions
Kit has a built-in function for confirming whether or not it's permissions are correct, in case you've accidentally removed any or given it permissions it doesn't need.
To use this, just use `k?permissions` and the bot will let you know what it needs, doesn't need, and any permissions that should be removed immediately.

<br>

# Moderation Functions
Kit has a handfull of moderation functions that need to be set up by server staff. Those functions and their setup instructions are listed below.

## Mute Command
How Kit's mute function works depends on how you set up your mute role. You can set up this role to restrict typing access to certain channels, or remove access entirely, that's up to you.
To add a mute role, use `k?mute roleadd <role name>`, replacing `<role name>` with the name of the role you chose to add.

**Remember: Test this to make sure Kit has the correct permissions to assign this role, and Kit's highest role is above the mute role in the role list**

## Mod Log
Kit's mod log can be set up to log many things:

    - Kicks
    - Leaves
    - Bans
    - Channel Changes
    - Nickname Changes
    - Deleted/Edited Messages

In order to use these functions, a few things need to be set up first.

**Mod Log Channel:** `k?modlog setchannel #channel`
**Mod Log Options:** `k?modlog toggle <option>`
    - logKicks
    - logChannels
    - logLeaves
    - logBans
    - logMembers
    - logMessages

Then finally, once you have these set up, run `k?modlog toggle` to enable the module.

## Server Password
Kit's server password function allows you to set up a channel to recieve a password in (you can hide this password in your rules, or somewhere else, that's up to you).
Every message sent in the selected channel will be deleted automatically after the bot has read it, so make sure you've typed any instructions you want to have in the password channel into it before enabling the module.

To add your password and channel, use `k?password setpass <password>`, then use `k?password setchan #channel`. Then to add the role that will be added upon entering the correct password, use `k?password setrole <role>`.

**Remember: Test this to make sure Kit has the correct permissions to assign this role, and Kit's highest role is above the mute role in the role list**

## Welcome Message
If you want, Kit can send a welcome message in a pre-determined channel any time a user joins your server. This can be a reminder to read the rules before speaking, or a simple greeting.
To use this function, use `k?welcome edit <message>` to set your welcome message, `k?welcome setchannel #channel` to set the channel for it to be set in, and `k?welcome toggle` to enable the module.

Welcome messages can contain automatically replaced tags to make personalized(-ish) welcome messages:
    - {member}          <- Is replaced with a user mention (@joining-user)
    - {member.username} <- Is replaced with the member's username (without the ping)
    - {guild}           <- Is replaced with the server's current name

<br>

# Bot Settings

## Prefixes
Kit's prefix can be customized to whatever you want it to be, including multiple words if they're surrounded by quotation marks. While you can set this to whatver you want, Kit's default prefix (k?) will always work.
To set a custom prefix, use `k?prefix <prefix>` or `k?prefix "<multiple word prefix>`. To check what the bot's prefix currently is, use `k?checkprefix`.
<br>

# Other

## Self-Assignable Roles
Kit can assign other users roles from a pre-determined list. These roles can be for accessing certain channels, pronouns, colors, etc.

To add a role, use `k?role add <role>`. You can use either the role's name, it's ID, or you can mention the role.
To remove a role, use `k?role delete <role>`, or `k?role delete missing` to remove any roles no longer present in the server.
To list roles after adding them, use `k?role list`, and `k?role <role>` to add them (partial matches for names will work).