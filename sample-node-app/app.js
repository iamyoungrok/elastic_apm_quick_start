// Add this to the VERY top of the first file loaded in your app
var apm = require('elastic-apm-node').start({
  // Required app name (allowed characters:a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'sample-node-app',
  // Use if APM Server requires a token
  //secretToken: '',
  // Set custom APM Server URL (default: http://localhost:8200)
  //serverUrl: ''
})

var app = require('express')()
var request = require('request')
var mysql = require('mysql')
var myConnection  = require('express-myconnection')
var config = require('./config')
var dbOptions = {
	host:	  	config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	port: 	  config.database.port,
	database: config.database.db
}

app.use(myConnection(mysql, dbOptions, 'pool'))

// 1. Root Path
app.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello sample-node-app');
})

// 2. Invoke SQL
app.get('/test/sql', function(req, res) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM user',function(err, rows, fields) {
			if (err) {
        throw err;
			}
      console.log(rows);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Result : ' + JSON.stringify(rows));
		})
	})
})

// 3. Invoke External HTTP Call
app.get('/test/http', function(req, res) {
	var url = 'http://amazon.com';
	request(url, function(error, response, html){
  	if (error) {
      throw error
    };
  	console.log(html);
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(html);
	});
})

// 4. Invoke captureError
app.get('/test/error', function(req, res) {
  apm.captureError(new Error('This is New Error'));
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.end('APM Captured Error.');
})

app.listen(8001, function(){
	console.log('Server running at port 8001: http://127.0.0.1:8001')
})
