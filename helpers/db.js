var mysql = require('promise-mysql');
var config = require('../config.json');

//get the parameters from the config json file
var params = {
	host : config.db.host,
	user : config.db.user,
	password : config.db.password,
	database : config.db.database
}

exports.throwConnectionError = function(err){
	console.error('unable to connect\n',err);
	//get the response object which was passed as an attribute of this function
	var res = exports.throwConnectionError.res;
	var errCode = exports.throwConnectionError.errCode;
	var status = exports.throwConnectionError.status || 500;
	res.status(status);
	res.json({
		success : false,
		error : err.code || errCode
	}); 
}

exports.throwError = function(err){
	console.error('Something went wrong...\n',err);
	//get the request and response objects which were passed as attributes of this function
	var res = exports.throwError.res;
	var req = exports.throwError.req;
	var errCode = exports.throwError.errCode;
	var status = exports.throwError.status || 500;
	res.status(status);
	res.json({
		success : false,
		error : err.code || errCode
	});
	//end the connection since this is a dead state
	req.conn.end();
}

exports.sendSQLResults = function(res,rows){
	res.json({
		success : true,
		error : '',
		result : rows,
		length : rows.length
	});
}

exports.getConnectionPromise = function(){
	//return a promise to allow the process to continue in external modules
	return mysql.createConnection(params);
}