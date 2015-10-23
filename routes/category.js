var shared = require('../app.js')
var utils = require('../helpers/utils.js')
var db = require('../helpers/db.js')

var throwSQLError = shared.throwSQLError
var sendSQLResults = shared.sendSQLResults

var query = ''
var queryParams = []
var categoryDetails = {}
var keys = []
var values = []

exports.listCategories = function(req,res,next){

	db.throwError.req = req
	db.throwError.res = res
	db.throwError.status = null
	db.throwError.errCode = null

	var getCategories = function(){
		//get the ids and names of all model categories
		query = 'SELECT * FROM category'
		queryParams = []
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(200)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}
	
	getCategories()
		.done(sendResults,db.throwError)	
}

exports.createCategory = function(req,res,next){
	var body = req.body
	var name = body['name']
	var categoryId

	db.throwError.req = req
	db.throwError.res = res
	db.throwError.status = null
	db.throwError.errCode = null

	var getCategoryColumns = function(){
		//get the columns of the category table
		query = 'SHOW COLUMNS FROM ??'
		queryParams = []
		queryParams.push('category')
		return req.conn.query(query,queryParams)
	}

	var buildCategoryDetails = function(rows,fields){
		//match the provided key-value pairs in the body to the columns of the category table
		categoryDetails = {}
		utils.buildDetails(rows,categoryDetails,body)
		keys = []
		values = []
		utils.getKeyValues(categoryDetails,keys,values)
		//insert the category into the table
		query = 'INSERT INTO ?? (??) VALUES (?)'
		queryParams = []
		queryParams.push('category')
		queryParams.push(keys)
		queryParams.push(values)
		return req.conn.query(query,queryParams)
	}

	var buildCategoryTable = function(rows,fields){
		//if a columns field is provided in the body, set columns as provided, else set columns to an empty array
		var columns = body.columns || []
		var numColumns = columns.length
		//build a query to create a table for the new category
		query = 'CREATE TABLE IF NOT EXISTS ?? ('
		//by default the table should have a model_id column
		query += ' model_id INT NOT NULL, '
		//add other columns if the are any
		for(var i=0;i<numColumns;i+=1){
			query += columns[i] + ', '
		}
		//the model_id field will always be the primary key
		query += ' PRIMARY KEY (??),'
		//build the foreign key constraint to reference the id field in the model table
		query += ' CONSTRAINT ??'
		query += ' FOREIGN KEY (??)'
		query += ' REFERENCES ?? (??)'
		query += ' ON DELETE CASCADE ON UPDATE CASCADE'
		query += ') ENGINE = InnoDB'
		queryParams = []
		queryParams.push(name)
		queryParams.push('model_id')
		queryParams.push('fk_'+name+'_model1')
		queryParams.push('model_id')
		queryParams.push('model')
		queryParams.push('id')
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(201)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	getCategoryColumns()
		.then(buildCategoryDetails)
		.then(buildCategoryTable)
		.done(sendResults,db.throwError)
}