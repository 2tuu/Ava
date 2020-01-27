exports.run = (client, message, args) => {

    if(args[0] === "toc"){
        if(args[1] === "f"){
        result = Math.round((args[2] -32) * 0.555);
        message.channel.send(args[2] + "°F is " + result + "°C")
        } else if(args[1] === "k"){
            result = Math.round(args[2] - 273.15);
        message.channel.send(args[2] + "K is " + result + "°C")
        } else if(args[1] === "c"){
        message.channel.send("What are you trying to accomplish?")
        } else {
            message.channel.send("Invalid structure (ie. k?temp toc f 100)")
        }
    } else if(args[0] === "tok"){
        if(args[1] === "c"){
            result = Math.round(parseInt(args[2]) + 273.15);
            message.channel.send(args[2] + "°C is " + result + "K")
        } else if(args[1] === "f"){
            result = Math.round(((args[2] -32) * 0.555) + 273.15);
        message.channel.send(args[2] + "°F is " + result + "K")
        } else if(args[1] === "k"){
            message.channel.send("What are you trying to accomplish?")
        } else {
            message.channel.send("Invalid structure (ie. k?temp toc f 100)")
        }
    } else if(args[0] === "tof"){
        if(args[1] === "c"){
            result = Math.round(args[2] * (9/5) + 32);
            message.channel.send(args[2] + "°C is " + result + "°F")
            } else if(args[1] === "k"){
                result = Math.round((9/5) * (args[2] - 273.15) + 32);
            message.channel.send(args[2] + "K is " + result + "°F")
            } else if(args[1] === "f"){
                message.channel.send("What are you trying to accomplish?")
            } else {
                message.channel.send("Invalid structure (ie. k?temp toc f 100)")
            }
    } else {
        message.channel.send("Invalid arguments");
    }

}

exports.conf = {
    help: "Convert Kelvin/Celsuis/Fahrenheit to any of those three",
    format: "k?temp [toc/tof/tok] [f/k/c]",
    DM: true,
    OwnerOnly: false,
    alias: ['temperature']
}