const { Pool, Client } = require('pg');

exports.get = async (que) => {

  const pool = new Pool({
    user: 'postgres',
    database: 'kit',
    password: 'toor'
  })

  var delay = 25;
  
  var exitvar;
  
  let result = pool.query(que, (err, res) => {
    if(err) return console.error(err);
    if(res.rows) exitvar = res.rows[0];
    pool.end()
  });

  return result;
    
}