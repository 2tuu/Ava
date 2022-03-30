exports.run = (deletedMessage, sql, client, emoji) => {
    client.emojiPile.push(emoji.id);
    console.log('Emoji cache updated (' + emoji.id + ')')
}