exports.run = (deletedMessage, sql, client, error) => {
    client.logChannel.send("```js\n***CLIENT ERROR:***\n```js\nERR: " + error + "\n```");
}