## Tag Docs
This page includes all possible attributes for KTag, it will be updated as features are added

## Time
Allows you to insert different parts of the current time (In PST, more timezones + math coming soon)
```
{time.hour}     -   Displays the current hour
{time.minute}   -   Displays the current minute, relative to the current hour
{time.year}     -   Displays the current gregorian year
{time.day}      -   Displays the current day as an integer (To be stringified)
```
## Caller
This refers to the caller's user object, it's attributes can be used
```
{caller.id}     -   The user ID of the person calling the tag
{caller.uname}  -   The username of the person calling the tag (not their nickname)
{caller.discrim}-   The discriminator of the person calling the tag (ie. #1234)
{caller.avatar} -   Returns the caller's avatar ID, can be combined with ID to form a URL
```
## Channel
This refers to the channel object for the channel where the tag was called, limited attributes can be used
```
{channel.id}    -   The ID of the channel
{channel.name}  -   The name of the channel (ie. #general -> 'general')
{channel.position}  -   The position of the channel on the channel list
{channel.parentID}  -   The ID of the category the channel is in, if it has one
{channel.topic} -   The topic set for the channel
{channel.nsfw}  -   Returns true or false based on the channel's NSFW Settings
```
## Guild
This refers to the guild (or server, whatever you want to call it) that the tag is executed in
```
{guild.id}      -   The ID of the guild
{guild.name}    -   The name of the guild
{guild.icon}    -   The server's icon ID, can be combined with ID to form a URL
{guild.splash}  -   The guild's invite splash image, if applicable
{guild.region}  -   The guild's region (ie. US_West)
{guild.memberCount} -   The number of members present in the guild
{guild.large}   -   Returns true if the guild has more than 250 members
{guild.joinedTimestamp} - The timestamp code for the time the server was created (Parser coming soon)
{guild.ownerID} -   Returns the ID of the server's owner
```
## Random number
This generates a number between 0 and the given number
```
{num;10}        -   Generates a number between 0 and 10
```
## Repeater
This repeats whatever is given in the arguments, this can be code as well
</br>**NOTE: If the output is too long, it may not send (will be sent in txt later on)**
```
{repeat;#;x}    -   Repeats 'x' # amount of times
```
## Chooser
This allows you to randomly choose from any text or variables
```
Assume that thing1, thing2, and thing3 are 3 things you've decided to choose

{choose;thing1;thing2;thing3}	-   Chooses one of the options you've given
```
## Arguments
This refers to the tags arguments, seperated by spaces or quotation marks
```
//Arguments are 0-indexed, remember it starts at 0, not 1

{arg1}          -   Second Argument
{args}          -   All arguments joined to one string

EXAMPLE:

k?tag tagname argument1 argument2 argument3 "argument4 with spaces"

{arg0} = argument1
{arg1} = argument2
{arg2} = argument3
{arg3} = argument4 with spaces
```
## Caller Arguments
These almost never have a practical use, but the argument is replaced with the caller's username if the argument is not given
</br>Acts the same as `{args}`

## Variables
Variables can be used to store data, this data can be recalled for later use (will work with logic once implimented)
```
Where a is the variable's name, and b is it's value

{set;a;b};      -   Set's the value 'b' to a variable called 'a'
{var.a};        -   Assuming 'a' is set to 'b', this will be replaced with 'b'
```
## If Statements
Only parses code inside the if statement if it's true
```
Where a and b are the variables to be compared (these cn be replaced with {var.#} variables), and 'code' is what will be parsed if the statement is true

{if;a==b;code}; <-- equals
{if;a=!b;code}; <-- does not equal
```
## Misc
```
{n}             -   The equivilent of pressing enter, adds a new line
{t}             -   The equivilent of pressing Tab, adds horizontal lines based on string length
{space}         -   Adds an extra space if needed
```
