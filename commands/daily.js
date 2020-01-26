const coins = require('./coins.js');

exports.run = (client, message, args, deletedMessage, sql, tossedSet, roles, queue) => {

    coins.run(client, message, ["add"], deletedMessage, sql, tossedSet, roles, queue);

}

exports.conf = {
    DM: true,
    OwnerOnly: false,
    alias: []
}