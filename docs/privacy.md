# Data Usage Statement / Privacy Policy
## Last updated: 3/10/2022

Below is the best summary I could write of the data Kit collects, and what it's used for. By using Kit you aknowledge all statements below.

Any data used and collected by Kit is not shared with a third party (besides Discord obviously) unless absolutely necessary.


# What Data is Stored Permanently
In short, no data is stored *forever*. Some data can be deleted by the users, other things, like profiles can be reset and made empty by a user. But regardless of whether or not the user themselves can delete it from the bot's database, it can be deleted entirely at the request of an admin.

## Profiles
Kit allows for the creation and storage of a customizeable user profile. This profile is visible to all users, but can only be modified by the user who created it.

A profile includes the following information:
- Username (+ discriminator)
- Useless Internet Points
- 2 Custom fields (Bio and Subtitle)
- Birthday (Day and Month)

Day, month and year of the set birthday are stored due to the way Kit needs to interpret entered dates, but only day and month are actually visible outside the timestamp entered into the database by Kit

Of these fields, only the bio and subtitle may be edited, while the birthday can be set once. Username/discriminator and point balance are all fetched and managed by the bot automatically.

Any errors in something like a birthday can be easily reset by an admin, and profiles may be removed entirely upon request. (This request can be made in the support server listed in Kit's Discord bio)

## Notes
Kit allows for the creation and storage of a note, which acts like a small text file. The user may input any information they want into this note, but unlike a profile this note cannot be accessed by anyone other than the user who created it. It can also be reset at will by the user who created it.

While information stored in a note is not accessible by any user other than the one who created it, it may still be viewed by another user if the note is requested in a public channel.


# Monitored Information
## Messages and Server Settings
Messages may be monitored by certain modules if they are enabled, as well as the bot in general in order to determine whether or not a messages is a command.

While data is not stored outside of discord some data may be reported to server staff depending on configuration of the modlog module.

This data may include:
- Deleted messages
- Edited messages and their previous content
- A nickname if recently edited

Other actions that may be monitored by this module:
- A user entering or exiting the server
- A user being banned or otherwise removed by server staff
- Messages contained in a message mass deletion
- Creation or modification of a channel's configuration

No message data outside of data given to certain modules for the express purpose of being stored (ie. Editing a profile card, a user's note, a server's welcome message or password, etc.) is stored or kept by the bot.


# Non-Personal Information
## Server-Specific Settings
Any settings set using the modlog, giverole, server password, prefix, or any future moderation module is stored alongside the rest of Kit's permanent data.

This data includes:
- ID of the server the settings are valid on
- Custom prefixes set by server staff
- True/false values pertaining to whether modlog modules are enabled
- IDs of roles added by server staff to the giverole module
- Custom welcome messages set by server staff
- Server passwords

This information can be reset by the server staff at will, and modlog modules can also be disabled, but like the rest of the information stored this can be removed entirely at the request of an admin.

## User IDs
User IDs may be stored by some modules. These include the reminder, blacklist, profile, tag, and any other module that needs to confirm ownership or identity.

These IDs are used for:
- Identifying users banned from bot usage
- Identifying creators of server tags (to determine whether or not they are allowed to modify or remove them)
- Identifying owners of notes or profiles

A user's snowflake is only used to associate a database entry with their account.

## Tags
Users may create a 'tag' using Kit's rudimentary language KTag. These tags may include any code a user decides to put into them. These tags may be deleted and modified only by the user who created them, and server staff, but may be summoned by any user.

The only data stored by this module is the code within the tag itself. Any text given to the tag is taken in, interpreted according to the code within the tag, and passed back to discord.

# Information Removal Requests
As stated before, any information that cannot be completely removed by a user (D/M birthday set in profile and profile point balance, or an empty note) can be removed at the request of an admin by asking in Kit's support Discord server.

This Discord server's current link will be available in Kit's user profile, under the bio section, along with a Trello board containing any current bugs and future addition progress.