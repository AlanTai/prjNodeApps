/* config. */
// require necessary modules
GLOBAL.mongojs = require('mongojs');
GLOBAL.mysql = require('mysql');

// localhost mongo config.
GLOBAL.local_db = mongojs('localhost/crowdfunding', ['fund364_temp']);
GLOBAL.local_collection = local_db.collection('fund364_temp');

// remote mongo config.
GLOBAL.remote_db = mongojs('fund364db_user:fund364crowding@45.56.85.129/fund364db_new', ['fund364']);
GLOBAL.remote_collection = remote_db.collection('fund364');

// set mysql
GLOBAL.mysql_connection = mysql.createConnection({
	host : 'localhost',
	user : 'fund364_user',
	password : 'crowdFunding'
});

mysql_connection.connect();
mysql_connection.query('SELECT * FROM user', function(err, rows, fields){
	console.log(rows);
});

// start testing
local_collection.find(function(err, docs){
	console.log(docs);
});

remote_collection.find(function(err, docs){
	console.log(docs);
	// end connections
	mysql_connection.end(function(err){
		console.log('end mysql');
	});
	process.exit( code = 0 );
});