exports.run = (client, message) => {
message.channel.send("beep");
		setTimeout(() => {
          message.channel.send("boop");
          setTimeout(() => {
            message.channel.send("meow");
          }, 3000);
        }, 1000);
    }

    exports.conf = {
        DM:  true,
        OwnerOnly: false
    }