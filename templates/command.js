exports.run = (client, message, args, deletedMessage, pool, tossedSet, roles) => { //all imported variables, this can be cut down

    //command code here

}

exports.conf = {
    name: "Command name (used in stats collector)",
    help: "Help file content (explains the use of the command)",
    format: "Command usage format, ie. 'k?command [option]' ",
    DM: false, //decides whether or not this command works in a DM channel (dming the bot without a prefix)
    OwnerOnly: false, //decides whether or not this command can only be used by the owner in the config file
    alias: [] //put command aliases here, and the bot will respond to these as well as the command file name
}