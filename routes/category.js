var shared = require('../app.js')
var utils = require('../helpers/utils.js')
var db = require('../helpers/db.js')
var err = require('../helpers/error.js')

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
		var col
		var numColumns = columns.length
		//build a query to create a table for the new category
		query = 'CREATE TABLE IF NOT EXISTS ?? ('
		//by default the table should have a model_id column
		query += ' model_id INT NOT NULL, '
		queryParams = []
		queryParams.push(name)
		//add other columns if the are any
		for(var i=0;i<numColumns;i+=1){
			col = columns[i]
			//add the column field and its type to the table (e.g. series_number int(11))
			query += col['Field'] + ' ' + col['Type']
			//if the column is nullable, add NOT NULL
			if(col['Null'] === 'NO'){
				query += ' NOT NULL'
			} 
			if(col['Default'] !== null){
				//wrap the default value in escaped single quotes so that it is enclosed in single quotes in the query
				query += ' ' + 'DEFAULT ?'
				queryParams.push(col['Default'])
			}
			query += ', '
		}
		//the model_id field will always be the primary key in a category table
		query += ' PRIMARY KEY (??),'
		//build the foreign key constraint to reference the id field in the model table
		query += ' CONSTRAINT ??'
		query += ' FOREIGN KEY (??)'
		query += ' REFERENCES ?? (??)'
		query += ' ON DELETE CASCADE ON UPDATE CASCADE'
		query += ') ENGINE = InnoDB'
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


exports.viewCategory = function(req,res,next){
	var categoryId = req.params.id
	var category = {}

	db.throwError.req = req
	db.throwError.res = res
	db.throwError.status = null
	db.throwError.errCode = null

	var getCategory = function(){
		//get the category information from the category table
		query = 'SELECT * FROM category WHERE id = ?'
		queryParams = []
		queryParams.push(categoryId)
		return req.conn.query(query,queryParams)
	}

	var getCategoryColumns = function(rows,fields){
		if(rows.length > 0){
			//since only one row is expected, get only the row at index 0
			category = rows[0]
			var categoryName = category['name']
			//if the category is 'other', skip getting the columns of the corresponding category table
			if(categoryName === 'other'){
				res.status(200)
				db.sendSQLResults(res,category)
				req.conn.end()
			} else {
				//get the columns of the corresponding category table
				query = 'SHOW COLUMNS FROM ??'
				queryParams = []
				queryParams.push(categoryName)
				return req.conn.query(query,queryParams)
						  .then(sendResults)
			}
		} else {
			db.throwError.status = 404
			//call the throwError function directly since there will be no next promise to catch the error
			db.throwError(err.generateCategoryNotFoundError(''))
		}
	}

	var sendResults = function(rows,fields){
		category['columns'] = rows
		res.status(200)
		db.sendSQLResults(res,category)
		req.conn.end()
	}

	getCategory()
		.done(getCategoryColumns,db.throwError)
}

exports.deleteCategory = function(req,res,next){
	var categoryId = req.params.id
	var categoryName
	var otherCategoryId

	db.throwError.req = req
	db.throwError.res = res
	db.throwError.status = null
	db.throwError.errCode = null

	var getOtherCategory = function(){
		query = 'SELECT id FROM category WHERE name = ?'
		queryParams = []
		queryParams.push('other')
		return req.conn.query(query,queryParams)
	}

	var removeModelsFromCategory = function(rows,fields){
		otherCategoryId = rows[0]['id']
		query = 'UPDATE ?? SET ? WHERE category_id = ?'
		queryParams = []
		queryParams.push('model_has_category')
		queryParams.push({category_id : otherCategoryId})
		queryParams.push(categoryId)
		return req.conn.query(query,queryParams)
	}

	var getCategoryName = function(rows,fields){
		query = 'SELECT name FROM category WHERE id = ?'
		queryParams = []
		queryParams.push(categoryId)
		return req.conn.query(query,queryParams)
	}

	var dropCategoryTable = function(rows,fields){
		categoryName = rows[0]['name']
		query = 'DROP TABLE ??'
		queryParams = []
		queryParams.push(categoryName)
		return req.conn.query(query,queryParams)
	}

	var deleteCategoryInfo = function(rows,fields){
		query = 'DELETE FROM category WHERE id = ?'
		queryParams = []
		queryParams.push(categoryId)
		return req.conn.query(query,queryParams)
	}
	var sendResults = function(rows,fields){
		res.status(204)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	getOtherCategory()
		.then(removeModelsFromCategory)
		.then(getCategoryName)
		.then(dropCategoryTable)
		.then(deleteCategoryInfo)
		.done(sendResults,db.throwError)
}