exports.run = (client, message, args) => {

    var first = [
        "Stinky","Lumpy","Buttercup","Gidget","Crusty","Greasy","Fluffy","Cheeseball","Chim-Chim",
        "Poopsie","Flunky","Booger","Pinky","Zippy","Goober","Doofus","Slimy",
        "Loopy","Snotty","Falafel","Dorky","Squeezit","Oprah","Skipper","Dinky","Zsa-Zsa"
    ];

    var middle = [
        "Diaper","Toilet","Giggle","Bubble","Girdle","Barf","Lizard","Waffle","Cootie",
        "Monkey","Potty","Liver","Banana","Rhino","Burger","Hamster","Toad",
        "Gizzard","Pizza","Gerbil","Chicken","Pickle","Chuckle","Tofu","Gorilla","Stinker"
    ];

    var last = [
        "Head","Mouth","Face","Nose","Tush","Breath","Pants","Shorts","Lips",
        "Honker","Butt","Brain","Tushie","Chunks","Hiney","Biscuits","Toes",
        "Buns","Fanny","Sniffer","Sprinkles","Kisser","Squirt","Humperdinck","Brains","Juice"
    ];


    if(!args[0]){
    first = first[Math.floor(Math.random() * first.length)];
    middle = middle[Math.floor(Math.random() * middle.length)];
    last = last[Math.floor(Math.random() * last.length)];

    message.channel.send(`\`YOUR MR. POOPY PANTS NAME IS: ${first} ${middle} ${last}\``, {
        files: []
      });

    } else {
        first = first[Math.floor(Math.random() * first.length)];
        middle = middle[Math.floor(Math.random() * middle.length)];
        last = last[Math.floor(Math.random() * last.length)];
    
        message.channel.send(`\`YOUR MR. POOPY PANTS NAME IS: ${first} ${middle} ${last}\``, {
            files: []
          });
    }

}

exports.conf = {
    help: "I don't wanna explain this",
    format: "k?poopy",
    DM: true,
    OwnerOnly: false,
    alias: []
}