var mysql = require('mysql');
var config = require('./../config.json');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : config.dbuser,
    password : config.dbpasswd,
    database : config.dbname
  });

  connection.query('CREATE TABLE announce (guild TEXT, channel TEXT);', function(err, rows){
    if(err) {
     throw "SQL Error: " + err;
    }
    console.log('Created "announce" table successfully');
  });

  connection.query('CREATE TABLE blacklist (userid TEXT, reason TEXT);', function(err, rows){
    if(err) {
     throw "SQL Error: " + err;
    }
    console.log('Created "blacklist" table successfully');
  });

    connection.query('CREATE TABLE modlog (logKicks TEXT, logReactions TEXT, logChannels TEXT, logEmojis TEXT, logBans TEXT, logLeaves TEXT, logMembers TEXT, logMessages TEXT, logRoles TEXT, serverId TEXT, enabled TEXT, channel TEXT);', function(err, rows){
    if(err) {
     throw "SQL Error: " + err;
    }
    console.log('Created "modlog" table successfully');
  });

  connection.query('CREATE TABLE note (note BLOB, ownerId TEXT);', function(err, rows){
    if(err) {
     throw "SQL Error: " + err;
    }
    console.log('Created "note" table successfully');
  });

  connection.query('CREATE TABLE nsfw (id TEXT, birthyear TEXT);', function(err, rows){
    if(err) {
     throw "SQL Error: " + err;
    }
    console.log('Created "nsfw" table successfully');
  });

  connection.query('CREATE TABLE prefix (prefix TEXT, welcomeMessage TEXT, welcomeChannel TEXT, shouldWelcome TEXT, serverId TEXT);', function(err, rows){
    if(err) {
     throw "SQL Error: " + err;
    }
    console.log('Created "prefixes" table successfully');
  });

  connection.query('CREATE TABLE profile (userId TEXT, quarters TEXT, badge TEXT, desc TEXT, color TEXT, cmds TEXT, qTime TEXT);', function(err, rows){
    if(err) {
     throw "SQL Error: " + err;
    }
    console.log('Created "profile" table successfully');
  });

  connection.query('CREATE TABLE prefix (prefix TEXT, welcomeMessage TEXT, welcomeChannel TEXT, shouldWelcome TEXT, serverId TEXT);', function(err, rows){
    if(err) {
     throw "SQL Error: " + err;
    }
    console.log('Created "prefixes" table successfully');
  });

  connection.query('CREATE TABLE settings (serverId TEXT, banId TEXT);', function(err, rows){
    if(err) {
     throw "SQL Error: " + err;
    }
    console.log('Created "settings" table successfully');
  });

  connection.query('CREATE TABLE tags (serverID TEXT, tagName TEXT, tagContent TEXT, ownerID TEXT, selfDelete TEXT);', function(err, rows){
    if(err) {
     throw "SQL Error: " + err;
    }
    console.log('Created "tags" table successfully');
  });

  connection.query('CREATE TABLE timer (endtime TEXT, user TEXT, channelcreated TEXT, message TEXT);', function(err, rows){
    if(err) {
     throw "SQL Error: " + err;
    }
    console.log('Created "time" table successfully');
  });

  connection.end();

  console.log('SQL database setup successful');