
exports.run = (client, message, args) => {


    //(Math.floor(Math.random()*5) + 1);

    function roll(){
        var response = [];

        response[0] = (Math.floor(Math.random()*5) + 1);
        response[1] = (Math.floor(Math.random()*5) + 1);
        response[2] = (Math.floor(Math.random()*5) + 1);
        response[3] = (Math.floor(Math.random()*5) + 1);
        response[4] = (Math.floor(Math.random()*5) + 1);
        response[5] = (Math.floor(Math.random()*5) + 1);
        response[6] = (Math.floor(Math.random()*5) + 1);
        response[7] = (Math.floor(Math.random()*5) + 1);
        response[8] = (Math.floor(Math.random()*5) + 1);
        response[9] = (Math.floor(Math.random()*5) + 1);

        var i = 1;
        var count = 0;

        while(i < response.length){
            if(response[i-1] === 4){
                count = count+1;
            }
            i = i + 1;
        }

        return count;
    }

    var it = parseInt(args[0]);
    var mess = [];

    var b = 10
    while(b > 0){
        mess[b-1] = 0;
        b = b-1;
    }
    
        while(it > 0){
            
            var r = roll();
            if(!mess[r]) mess[r] = 0;
            mess[r] = mess[r] + 1;

            it = it - 1;

        }



    message.channel.send(mess.join(", "));

}

exports.conf = {
    DM: true,
    OwnerOnly: true
}
