var scalc = require('mathjs');
exports.run = (client, message, args) => {
    //todo: figure this out

    //pemdas - maybe look for ÷ and x as alternatives

    async function math(m){

        if(m.parenthesis){

        }

    }

    var calc = args.join(' ');
    if(args.length < 1) return; //no args error here

    //Parenthesis ()
    var parenthesis = calc.match(/\((.*?)\)/g);

    console.log(`p = ${parenthesis}`);
    console.log(`c = ${calc}`);

    //Exponents #^power


    //Multiplication *


    //Division /


}

exports.conf = {
    category: "Utility",
    name: "Calculator",
    help: "It's a calculator",
    format: "k?calc [mathematical function]",
    DM: true,
    OwnerOnly: true,
    alias: []
}