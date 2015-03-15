/* config. */
// require necessary modules
GLOBAL.mongojs = require('mongojs');

// localhost mongo config.
GLOBAL.local_db = mongojs('localhost/crowdfunding', ['fund364_temp']);
GLOBAL.local_collection = local_db.collection('fund364_temp');

// remote mongo config.
GLOBAL.remote_db = mongojs('fund364db_user:fund364crowding@45.56.85.129/fund364db_new', ['fund364']);
GLOBAL.remote_collection = remote_db.collection('fund364');

local_collection.find(function(err, docs){
	console.log(docs);
});

remote_collection.find(function(err, docs){
	console.log(docs);
	process.exit( code = 0 );
});
