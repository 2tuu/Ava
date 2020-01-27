const coins = require('./coins.js');

exports.run = (client, message, args, deletedMessage, sql, tossedSet, roles, queue) => {

    coins.run(client, message, ["add"], deletedMessage, sql, tossedSet, roles, queue);

}

exports.conf = {
    help: "Collect your daily quarter",
    format: "k?daily",
    DM: true,
    OwnerOnly: false,
    alias: []
}