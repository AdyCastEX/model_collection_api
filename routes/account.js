var shared = require('../app.js')
var utils = require('../helpers/utils.js')
var bcrypt = require('bcrypt-nodejs')

var throwSQLError = shared.throwSQLError
var sendSQLResults = shared.sendSQLResults

var query = ''
var queryParams = []
var userDetails = {}
var keys = []
var values = []

/*
	Encrypts a given password using the bycrypt library

	Parameters:

	data             -- the password to encrypt (string)
	callback         -- a callback function to be called as soon as encryption is complete
*/

var encryptPassword = function(data,callback){

	var generateSaltCallback = function(err,result){
		//result holds the generated salt
		bcrypt.hash(data,result,null,callback)
	}
	//generate random data to add to the hash as additional data
	bcrypt.genSalt(10,generateSaltCallback)
}

exports.viewUser = function(req,res,next){
	var userId = req.params.id

	var getUserCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			res.status(200)
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	//get the user with the specified id
	query = 'SELECT * FROM ?? WHERE id = ?'
	queryParams = []
	queryParams.push('user')
	queryParams.push(userId)
	req.conn.query(query,queryParams,getUserCallback)
}

exports.createUser = function(req,res,next){
	var body = req.body

	var insertUserCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			res.status(201)
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	var encryptPasswordCallback = function(err,result){
		if(err){
			res.status(500)
			res.json({
				success : false,
				error : err.code
			})
			req.conn.release()
		} else {
			keys = []
			values = []
			//set the password as the result of the encryption
			userDetails['password'] = result
			//split the details' keys and values into separate arrays
			utils.getKeyValues(userDetails,keys,values)

			//create the user
			query = 'INSERT INTO ?? (??) VALUES (?)'
			queryParams = []
			queryParams.push('user')
			queryParams.push(keys)
			queryParams.push(values)
			req.conn.query(query,queryParams,insertUserCallback)
		}
	}

	var getUserColumnsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else {
			userDetails = {}
			//build the user details from the body
			utils.buildDetails(rows,userDetails,body)
			//encrypt the password for extra security
			encryptPassword(userDetails['password'],encryptPasswordCallback)
		}
	}

	//get the columns of the table that stores the users
	query = 'SHOW COLUMNS FROM ??'
	queryParams = []
	queryParams.push('user')
	req.conn.query(query,queryParams,getUserColumnsCallback)
}

exports.deleteUser = function(req,res,next){
	var userId = req.params.id

	var deleteUserCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			res.status(204)
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	query = 'DELETE FROM ?? WHERE id = ?'
	queryParams = []
	queryParams.push('user')
	queryParams.push(userId)
	req.conn.query(query,queryParams,deleteUserCallback)
}

exports.updateUser = function(req,res,next){
	var body = req.body
	var userId = req.params.id

	var updateUserCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			res.status(200)
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	var encryptPasswordCallback = function(err,result){
		if(err){
			res.status(500)
			res.json({
				success : false,
				error : err.code
			})
			req.conn.release()
		} else {
			//set the password to the encrypted version
			userDetails['password'] = result
			//update the user
			query = 'UPDATE ?? SET ? WHERE id = ?'
			queryParams = []
			queryParams.push('user')
			queryParams.push(userDetails)
			queryParams.push(userId)
			req.conn.query(query,queryParams,updateUserCallback)
		}
	}

	var getUserColumnsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else {
			userDetails = {}
			//build the details of the fields to update
			utils.buildDetails(rows,userDetails,body)

			//if the password is to be updated, encrypt the newly provided password
			if('password' in userDetails){
				encryptPassword(userDetails['password'],encryptPasswordCallback)
			} else { 
				query = 'UPDATE ?? SET ? WHERE id = ?'
				queryParams = []
				queryParams.push('user')
				queryParams.push(userDetails)
				queryParams.push(userId)
				req.conn.query(query,queryParams,updateUserCallback)
			}
		}
	}

	//determine the columns of the user table
	query = 'SHOW COLUMNS FROM ??'
	queryParams = []
	queryParams.push('user')
	req.conn.query(query,queryParams,getUserColumnsCallback)
}