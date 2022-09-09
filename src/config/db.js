const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '22061999',
  database : 'profile',
  multipleStatements: true
});

connection.connect(()=>{
    console.log("connected db")
})

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
    console.log("hahah")
  });

module.exports = connection;
