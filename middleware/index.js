var shared = require('../app.js')
var getConnection = shared.getConnection
var db = require('../helpers/db.js')
var config = require('../config.json')
var P = require('bluebird')
var jwt = P.promisifyAll(require('jsonwebtoken'))

exports.createConnection = function(req,res,next){

	//get the promise that was created by establishing a db connection
	var connectionPromise = db.getConnectionPromise()

	var setConnection = function(conn){
		req.conn = conn
		console.log('Connection established with ' + req.ip)
		next()
	}

	//set the response object as an attribute to allow access within the throwConnectionError() function 
	db.throwConnectionError.res = res
	connectionPromise.then(setConnection,db.throwConnectionError)
}

exports.verifyUserSession = function(req,res,next){
	//get the login token from the headers
	var token = req.get('Login-Token')
	db.throwConnectionError.res = res

	var verifyUserToken = function(){
		//use the secret for regular users to decode the token (should fail if a token for an admin is used)
		var secret = config.token.user_secret
		db.throwConnectionError.errCode = 'USER_NOT_LOGGED_IN'
		return jwt.verifyAsync(token,secret)
	}

	var getDecodedPayload = function(decoded){
		//add the user id to the request
		req.userId = decoded['id']
		next()
	}

	verifyUserToken()
		.done(getDecodedPayload,db.throwConnectionError)
}

exports.verifyAdminSession = function(req,res,next){
	//get the login token from the headers
	var token = req.get('Login-Token')
	db.throwConnectionError.res = res

	var verifyAdminToken = function(){
		//use the secret for admin users to decode the token
		var secret = config.token.admin_secret
		db.throwConnectionError.errCode = 'ADMIN_NOT_LOGGED_IN'
		return jwt.verifyAsync(token,secret)
	}

	var getDecodedPayload = function(decoded){
		req.userId = decoded['id']
		next()
	}

	verifyAdminToken()
		.done(getDecodedPayload,db.throwConnectionError)
}