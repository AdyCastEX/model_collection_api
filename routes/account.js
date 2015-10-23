var shared = require('../app.js')
var utils = require('../helpers/utils.js')
var email = require('../helpers/email.js')
var bcrypt = require('bcrypt-as-promised')
var db = require('../helpers/db.js')
var P = require('bluebird')
var jwt = P.promisifyAll(require('jsonwebtoken'))
var config = require('../config.json')
var jade = require('jade')
var path = require('path')
var err = require('../helpers/error.js')

var query = ''
var queryParams = []
var userDetails = {}
var keys = []
var values = []

/*
	Encrypts a given password using the bycrypt library

	Parameters:

	data             -- the password to encrypt (string)

	Returns : 
	
	encryptPromise   -- a promise that contains the result of the encryption
*/

var encryptPassword = function(data){

	var generateSalt = function(){
		//generate random data to add to the hash as additional data
		return bcrypt.genSalt(10)
	}

	var hashPassword = function(result){
		//result holds the generated salt
		return bcrypt.hash(data,result)
	}
	
	var encryptPromise = generateSalt().then(hashPassword)
	return encryptPromise
}

exports.viewUser = function(req,res,next){
	var userId = req.params.id

	db.throwError.req = req
	db.throwError.res = res

	var getUser = function(){
		//get the user with the specified id
		query = 'SELECT * FROM ?? WHERE id = ?'
		queryParams = []
		queryParams.push('user')
		queryParams.push(userId)
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(200)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}
	
	getUser()
		.done(sendResults,db.throwError)
}

exports.createUser = function(req,res,next){
	var body = req.body
	var result = []

	db.throwError.req = req
	db.throwError.res = res

	var getColumns = function(){
		//get the columns of the table that stores the users
		query = 'SHOW COLUMNS FROM ??'
		queryParams = []
		queryParams.push('user')
		return req.conn.query(query,queryParams)
	}

	var encodePassword = function(rows,fields){
		userDetails = {}
		//build the user details from the body
		utils.buildDetails(rows,userDetails,body)
		//encrypt the password for extra security
		return encryptPassword(userDetails['password'])
	}

	var insertUserData = function(result){
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
		return req.conn.query(query,queryParams)
	}

	var sendActivationEmail = function(rows,fields){
		result = rows
		return email.sendActivationEmail(userDetails)
	}

	var sendResults = function(info){
		res.status(201)
		db.sendSQLResults(res,result)
		req.conn.end()
	}

	getColumns()
		.then(encodePassword)
		.then(insertUserData)
		.then(sendActivationEmail)
		.done(sendResults,db.throwError)
}

exports.deleteUser = function(req,res,next){
	var userId = req.params.id

	db.throwError.req = req
	db.throwError.res = res

	var removeUser = function(){
		query = 'DELETE FROM ?? WHERE id = ?'
		queryParams = []
		queryParams.push('user')
		queryParams.push(userId)
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(204)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	removeUser()
		.done(sendResults,db.throwError)	
}

exports.updateUser = function(req,res,next){
	var body = req.body
	var userId = req.params.id

	db.throwError.req = req
	db.throwError.res = res

	var getColumns = function(){
		//determine the columns of the user table
		query = 'SHOW COLUMNS FROM ??'
		queryParams = []
		queryParams.push('user')
		return req.conn.query(query,queryParams)
	}

	var editUserOrEncodePassword = function(rows,fields){
		userDetails = {}
		//build the details of the fields to update
		utils.buildDetails(rows,userDetails,body)

		//if the password is to be updated, encrypt the newly provided password
		if('password' in userDetails){
			return encryptPassword(userDetails['password'])
						     .then(editUser)
		} else { 
			query = 'UPDATE ?? SET ? WHERE id = ?'
			queryParams = []
			queryParams.push('user')
			queryParams.push(userDetails)
			queryParams.push(userId)
			return req.conn.query(query,queryParams)
		}
	}

	var editUser = function(result){
		//set the password to the encrypted version
		userDetails['password'] = result
		//update the user
		query = 'UPDATE ?? SET ? WHERE id = ?'
		queryParams = []
		queryParams.push('user')
		queryParams.push(userDetails)
		queryParams.push(userId)
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(200)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	getColumns()
		.then(editUserOrEncodePassword)
		.done(sendResults,db.throwError)
}

exports.activateUser = function(req,res,next){
	var token = req.params.token || req.query.token || req.body.token

	db.throwError.req = req
	db.throwError.res = res

	var verifyToken = function(){
		return jwt.verifyAsync(token,config.mailer.secret)
	}

	var readUserDetails = function(decoded){
		userDetails = decoded
		query = 'UPDATE ?? SET ? WHERE email = ?'
		queryParams = []
		queryParams.push('user')
		queryParams.push({status : 'activated'})
		queryParams.push(userDetails['email'])
		return req.conn.query(query,queryParams)
	}

	var renderSuccessPage = function(rows,fields){
		var htmlTemplate = 'html.jade'
		var templateDir = path.join(__dirname,'..','public','templates','activation_success_page')
		var options = {
			pretty : true
		}
		var locals = {}
		var jadeRenderer = jade.compileFile(path.join(templateDir,htmlTemplate),options)
		var html = jadeRenderer(locals) 
		res.send(html)
		req.conn.end()
	}

	verifyToken()
		.then(readUserDetails)
		.done(renderSuccessPage,db.throwError)
}

exports.login = function(req,res,next){
	var email = req.body.email
	var password = req.body.password

	db.throwError.req = req
	db.throwError.res = res

	var findUser = function(){
		query = 'SELECT ?? FROM user WHERE email = ? AND status = ?'
		queryParams = []
		queryParams.push(['id','is_admin','password'])
		queryParams.push(email)
		queryParams.push('activated')
		return req.conn.query(query,queryParams)
	}

	var checkPassword = function(rows,fields){
		if(rows.length > 0){
			userDetails = rows[0]
			var passwordHash = userDetails['password']
			db.throwError.errCode = 'INCORRECT_PASSWORD'
			return bcrypt.compare(password,passwordHash)
		} else {
			res.status(404)
			throw err.generateUserNotFoundError(email)
		}
	}

	var createLoginToken = function(result){
		var secret = config.token.user_secret
		if(userDetails['is_admin'] == 1){
			secret = config.token.admin_secret
		}
		delete userDetails['password']
		var token = {}
		token['code'] = jwt.sign(userDetails,secret)
		res.status(200)
		db.sendSQLResults(res,token)
		req.conn.end()
	}

	findUser()
		.then(checkPassword)
		.done(createLoginToken,db.throwError)
}