var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twittertest";
/**
 * New node file
 */
function getNextSeqNumber(name, callback) {
	
	query = {'_id' : name};
	sort = [];
	operator = { '$inc' : {seqno : 1}};
	options = { 'new' : true, upsert : true};
	mongo.connect(mongoURL, function(db){
	   db.collection("SeqNumber").findAndModify(query, sort, operator,options, function(err, docs){
	        	  callback(docs.value.seqno);
	          });
	});
}

exports.getNextSeqNumber=getNextSeqNumber;