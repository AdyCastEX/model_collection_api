var shared = require('../app.js')
var utils = require('../helpers/utils.js')
var bcrypt = require('bcrypt-nodejs')

var throwSQLError = shared.throwSQLError
var sendSQLResults = shared.sendSQLResults

var query = ''
var queryParams = []
var accountDetails = {}
var keys = []
var values = []

var encryptPassword = function(data,callback){

	var generateSaltCallback = function(err,result){
		bcrypt.hash(data,result,null,callback)
	}

	bcrypt.genSalt(10,generateSaltCallback)
}

exports.viewAccount = function(req,res,next){
	var accountId = req.params.id

	var getAccountCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			res.status(200)
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	query = 'SELECT * FROM ?? WHERE id = ?'
	queryParams = []
	queryParams.push('user')
	queryParams.push(accountId)
	req.conn.query(query,queryParams,getAccountCallback)
}

exports.createAccount = function(req,res,next){
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
		keys = []
		values = []
		accountDetails['password'] = result
		utils.getKeyValues(accountDetails,keys,values)

		query = 'INSERT INTO ?? (??) VALUES (?)'
		queryParams = []
		queryParams.push('user')
		queryParams.push(keys)
		queryParams.push(values)
		req.conn.query(query,queryParams,insertUserCallback)
	}

	var getAccountColumnsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else {
			accountDetails = {}
			utils.buildDetails(rows,accountDetails,body)
			encryptPassword(accountDetails['password'],encryptPasswordCallback)
			
		}
	}

	query = 'SHOW COLUMNS FROM ??'
	queryParams = []
	queryParams.push('user')
	req.conn.query(query,queryParams,getAccountColumnsCallback)
}