exports.run = (client, message) => {
		setTimeout(() => {
          message.channel.send("boop");
          setTimeout(() => {
            message.channel.send("meow");
          }, 3000);
        }, 1000);
    }

    exports.conf = {
      help: "boop",
      format: "meow",
      DM: true,
      OwnerOnly: false,
      alias: []
  }