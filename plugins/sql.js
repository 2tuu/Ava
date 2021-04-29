var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'toor',
  database : 'kit'
});

const delay = 50;

var exportvar = [];

exports.run = (que) => {

    connection.query(que, function(err, rows){
        if(err) {
          throw err;
        } else {
          setValue(rows);
        }
      });
    
    //console.log(result);

    function setValue(value) {
        exportvar = value;
        //console.log(exportvar);
    }

    require('deasync').sleep(delay);

    //connection.end();
 
    return exportvar[0];
    
}

exports.get = (que) => {

    connection.query(que, function(err, rows){
        if(err) {
          throw err;
        } else {
          setValue(rows);
        }
      });
    
    //console.log(result);

    function setValue(value) {
        exportvar = value;
        //console.log(exportvar);
    }

    require('deasync').sleep(delay);

    //connection.end();
 
    return exportvar[0];
    
}

exports.all = (que) => {    

    connection.query(que, function(err, rows){
        if(err) {
          throw err;
        } else {
          setValue(rows);
        }
      });
    
    //console.log(result);

    function setValue(value) {
        exportvar = value;
        //console.log(exportvar);
    }


    require('deasync').sleep(delay);

    //connection.end();
 
    return exportvar;
    
}