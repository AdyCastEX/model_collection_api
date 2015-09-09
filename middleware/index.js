var shared = require('../app.js')
var getConnection = shared.getConnection
var db = require('../helpers/db.js')

exports.createConnection = function(req,res,next){

	//get the promise that was created by establishing a db connection
	var connectionPromise = db.getConnectionPromise()

	var setConnection = function(conn){
		req.conn = conn
		next()
	}

	//set the response object as an attribute to allow access within the throwConnectionError() function 
	db.throwConnectionError.res = res
	connectionPromise.then(setConnection,db.throwConnectionError)
}
