exports.run = async (client, message, args, deletedMessage, sql) => {

    var user = message.author.id;
    var channel = message.channel.id;
    var row;

    if(args[0] === "cancel"){
        row = sql.get(`SELECT * FROM timer WHERE user ="${message.author.id}"`);
        if(!row){ //no timers exist
            return message.channel.send("You have no timers running");
        } else { //timer already exists (limit 1 per user)
            sql.run(`DELETE FROM timer WHERE user ="${message.author.id}"`);
            return message.channel.send("Your timer has been deleted");
        }
    }

    if(isNaN(args[0])){
        return message.channel.send("Please enter a valid number of minutes");
    } else if(!args[1]){ //minute given but no message
        return message.channel.send("Please give me a message for your reminder.");
    } else if(!isNaN(args[1]) && !args[2]){ //hour given but no message
        return message.channel.send("Please give me a message for your reminder.");
    }

    //usage: k?remind [minutes] [hours] message

        var minutes = args[0] * 60000;
        var hours = 0;

        if(!isNaN(args[1])){
           hours = args[1] * 3600000;
        }

        var time = minutes+hours;

        if(time/60000 == 1){
            var min = 'minute';
        } else if(time < 0 || time > 604800001){
            return message.channel.send("Please enter a time between 0 minutes and 7 days");
        } else {
            var min = 'minutes';
        }

        var endtime = Date.now() + time;
        var timerMessage;

        if(isNaN(args[1])){
            timerMessage = args.slice(1).join(' ');
        } else {
            timerMessage = args.slice(2).join(' ');
        }

        if(timerMessage.length > 1921){
            return message.channel.send("Please give me a message below 1,920 characters");
        }

        message.channel.send(`I will tell you: \`${timerMessage}\` in ${time/60000} ${min}`);

        //sql
        row = sql.get(`SELECT * FROM timer WHERE user ="${user}"`);
        if(!row){ //no timers exist
            sql.run(`INSERT INTO timer (endtime, user, channelcreated, message) VALUES ('${endtime}', '${user}', '${channel}', '${timerMessage}')`);
        } else { //timer already exists (limit 1 per user)
            var timerEnd = Date.now();
                timerEnd = row.endtime - timerEnd;
            message.channel.send(`You already have a timer expiring in ${Math.round(timerEnd/60000) + 0.4} ${min}`);
        }

}

exports.conf = {
    help: "Remind yourself of something in the future",
    format: "k?remind [minutes] {optional: hours}",
    DM: true,
    OwnerOnly: true,
    alias: []
}