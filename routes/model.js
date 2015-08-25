var shared = require('../app.js')

var throwSQLError = shared.throwSQLError
var sendSQLResults = shared.sendSQLResults

var query = ''
var queryParams = []

/*
 	Creates a json object that maps table columns(keys) to attributes(values) in a request body
 	
 	Parameters:

 	rows             -- the resulting rows of an SQL query that fetches a table's column details
 	details          -- the json object that will contain the keys and values
 	body             -- a json object that contains attributes from a request body  
*/
var buildDetails = function(rows,details,body){
	var rowLength = rows.length
	var field

	for(var i=0;i<rowLength;i+=1){
		//since the row contains more details, get only the field which is the column name
		field = rows[i]['Field']
		//add the field to the details only if it can be found in the body
		if(field in body){
			if(body[field] === ''){
				//replace blank fields with a null value
				details[field] = null
			} else {
				//map the column to the corresponding value in the request body
				details[field] = body[field]
			}
		}
	}
}

/*
	Gets the keys and values of a json object

	Parameters:

	object            -- the json object to process
	keys              -- an array where the keys will be stored
	values            -- an array where the values will be stored	
*/
var getKeyValues = function(object,keys,values){
	
	//traverse through all the keys in the object
	for(key in object){
		keys.push(key)
		values.push(object[key])
	}
}

exports.listModels = function(req,res,next){
	var category = req.params.category
	var categoryId

	var selectCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			sendSQLResults(res,rows)
			req.conn.release()
		}
	}

	var getCategoryIdCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			//get the categoryId from the result of the previous query
			categoryId = rows[0]['id']
			//join the model and its category and select all the models that fall under the specified category
			query = 'SELECT * FROM model INNER JOIN model_has_category ON model.id = model_has_category.model_id WHERE model_has_category.category_id = ?'
			queryParams = []
			queryParams.push(categoryId)
			req.conn.query(query,queryParams,selectCallback)
		}
	}

	//model does not fall under a specific category
	if(category === 'other'){
		//find the id of the 'other' category
		query = 'SELECT id FROM category WHERE name = ?'
		queryParams = []
		queryParams.push(category)
		req.conn.query(query,queryParams,getCategoryIdCallback)
	} else{
		//find all models that fall under a particular category
		query = 'SELECT * FROM model INNER JOIN ?? ON model.id = ' + category + '.model_id'
		queryParams = []
		queryParams.push(category)
		req.conn.query(query,queryParams,selectCallback)
	}
}

exports.listCategories = function(req,res,next){
	
	var selectCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			sendSQLResults(res,rows)
			req.conn.release()
		}
	}

	//get the ids and names of all model categories
	query = 'SELECT id,name FROM category'
	queryParams = []
	req.conn.query(query,queryParams,selectCallback)
}

exports.viewModel = function(req,res,next){

	var modelId = req.params.id
	var modelCategoryId = ''
	var modelCategoryName = ''

	var selectCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	var getCategoryNameCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			if(rows.length > 0){
				modelCategoryName = rows[0]['name']
			}
			if(modelCategoryName === 'other'){ //if the model falls under the 'other' category, no need to join tables
				query = 'SELECT * FROM model WHERE id = ?'
				queryParams = []
				queryParams.push(modelId)
				req.conn.query(query,queryParams,selectCallback)
			} else { //join the model's data with its specific category data
				query = 'SELECT * FROM model INNER JOIN ?? ON model.id = ' + modelCategoryName + '.model_id WHERE model.id = ?'
				queryParams = []
				queryParams.push(modelCategoryName)
				queryParams.push(modelId)
				req.conn.query(query,queryParams,selectCallback)
			}
		}
	}

	var getCategoryIdCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			if(rows.length > 0){ //process only if the model exists
				//get the id of the category from the previous query
				modelCategoryId = rows[0]['category_id']
				//find the name of the category based on the id
				query = 'SELECT name FROM category WHERE id = ?'
				queryParams = []
				queryParams.push(modelCategoryId)
				req.conn.query(query,queryParams,getCategoryNameCallback)
			} else { //if the model does not exist, stop processing, return an error and release the connection
				res.status = 500
				res.json({
					success : false,
					error : 'MODEL_NOT_FOUND'
				})
				req.conn.release()
			}
		}
	}

	//find the category that the model falls under (will return an empty result if the model does not exist)
	query = 'SELECT category_id FROM model_has_category WHERE model_id = ?'
	queryParams = []
	queryParams.push(modelId)
	req.conn.query(query,queryParams,getCategoryIdCallback)
}

exports.createModel = function(req,res,next){
	var body = req.body
	var modelDetails = {}
	var specificDetails = {}
	var keys
	var values
	var category = body['category']
	var insertId = ''
	
	var insertModelCategoryCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			sendSQLResults(res,rows)
			req.conn.release()
		}
	}

	var insertSpecificModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			//set the category of the model by inserting into the model_has_category table
			query = 'INSERT INTO model_has_category (model_id,category_id) VALUES (?,(SELECT id FROM category WHERE name = ?))'
			queryParams = []
			queryParams.push(insertId)
			queryParams.push(category)
			req.conn.query(query,queryParams,insertModelCategoryCallback)
		}
	}

	var getSpecificColumnsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			//build the details of specific category
			buildDetails(rows,specificDetails,body)
			//override the NULL model_id field as the id of the last inserted model
			specificDetails['model_id']  = insertId
			keys = []
			values = []
			getKeyValues(specificDetails,keys,values)

			//insert into the specific category table
			query = 'INSERT INTO ?? (??) VALUES (?)'
			queryParams = []
			queryParams.push(category)
			queryParams.push(keys)
			queryParams.push(values)
			req.conn.query(query,queryParams,insertSpecificModelCallback)
		}
	}

	var insertModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			//set insertId as the id of the last row inserted to the model table
			insertId = rows.insertId

			if(category === 'other'){ //if the model falls under the 'other' category, go straight to inserting the the model_has_category table
				//to get the category id, run a subquery 
				query = 'INSERT INTO model_has_category (model_id,category_id) VALUES (?,(SELECT id FROM category WHERE name = ?))'
				queryParams = []
				queryParams.push(insertId)
				queryParams.push(category)
				req.conn.query(query,queryParams,insertModelCategoryCallback)
			} else { //else get the columns of the specific category table
				query = 'SHOW COLUMNS from ??'
				queryParams = []
				queryParams.push(category)
				req.conn.query(query,queryParams,getSpecificColumnsCallback)
			}
		}
	}

	var getColumnsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {

			//map the model details to the values in the request body
			buildDetails(rows,modelDetails,body)
			keys = []
			values = []
			getKeyValues(modelDetails,keys,values)
			//console.log(modelDetails)

			//insert the model based on the model details
			query = 'INSERT INTO model (??) VALUES (?)'
			queryParams = []
			queryParams.push(keys)
			queryParams.push(values)
			req.conn.query(query,queryParams,insertModelCallback)
		}
	}

	//determine the columns of the model table through this SQL query
	query = 'SHOW COLUMNS from model'
	queryParams = []
	req.conn.query(query,queryParams,getColumnsCallback) 

}

exports.deleteModel = function(req,res,next){
	var table = req.params.table
	var id = req.params.id
	var category = ''

	var removeModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			sendSQLResults(res,rows)
			req.conn.release()
		}
	}

	var removeCategoryCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else { //delete the model from the specified table (model or custom_model)
			query = 'DELETE FROM ?? WHERE id = ?'
			queryParams = []
			queryParams.push(table)
			queryParams.push(id)
			req.conn.query(query,queryParams,removeModelCallback)
		}
	}

	var removeSpecificModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else { //delete the model from the model_has_category table
			query = 'DELETE FROM model_has_category WHERE model_id = ?'
			queryParams = []
			queryParams.push(id)
			req.conn.query(query,queryParams,removeCategoryCallback)
		}
	}

	var getCategoryCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			//identify the category name from the result of the previous query
			category = rows[0]['name']

			if(category === 'other'){ //if in 'other' category, proceed to deleting the model from the model_has_category table
				query = 'DELETE FROM model_has_category WHERE model_id = ?'
				queryParams = []
				queryParams.push(id)
				req.conn.query(query,queryParams,removeCategoryCallback)
			} else { //else delete the model from the specific category table first
				query = 'DELETE FROM ?? WHERE model_id = ?'
				queryParams = []
				queryParams.push(category)
				queryParams.push(id)
				req.conn.query(query,queryParams,removeSpecificModelCallback)
			}
		}
	}

	//find the category (id and name) of the model to delete 
	query = 'SELECT id, name FROM category INNER JOIN model_has_category ON category.id = model_has_category.category_id WHERE model_has_category.model_id = ?'
	queryParams = []
	queryParams.push(id)
	req.conn.query(query,queryParams,getCategoryCallback)

}

exports.updateModel = function(req,res,next){
	var body = req.body
	var id = req.params.id
	var category = ''
	var modelDetails = {}

	var updateModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			sendSQLResults(res,rows)
			req.conn.release()
		}
	}

	var getColumnsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			modelDetails = {}
			//build the model details to update
			buildDetails(rows,modelDetails,body)
			//update the model
			query = 'UPDATE model SET ? WHERE id = ?'
			queryParams = []
			queryParams.push(modelDetails)
			queryParams.push(id)
			req.conn.query(query,queryParams,updateModelCallback)
		}
	}

	var updateSpecificModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			query = 'SHOW COLUMNS FROM model'
			queryParams = []
			req.conn.query(query,queryParams,getColumnsCallback)
		}
	}

	var getSpecificColumnsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			modelDetails = {}
			//build the model details to update
			buildDetails(rows,modelDetails,body)
			//update the model specified by model_id
			query = 'UPDATE ?? SET ? WHERE model_id = ?'
			queryParams = []
			queryParams.push(category)
			queryParams.push(modelDetails)
			queryParams.push(id)
			req.conn.query(query,queryParams,updateSpecificModelCallback)
		}
	}

	var getCategoryCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			//get the category from the result of the previous query
			category = rows[0]['name']

			if(category === 'other'){ //if the model falls under the 'other' category, update only the model table
				query = 'SHOW COLUMNS FROM model'
				queryParams = []
				req.conn.query(query,queryParams,getColumnsCallback)
			} else { //else update the table of the specific model category
				query = 'SHOW COLUMNS FROM ??'
				queryParams = []
				queryParams.push(category)
				req.conn.query(query,queryParams,getSpecificColumnsCallback)
			}
		}
	}

	//determine the category of the model
	query = 'SELECT id, name FROM category INNER JOIN model_has_category ON category.id = model_has_category.category_id WHERE model_has_category.model_id = ?'
	queryParams = []
	queryParams.push(id)
	req.conn.query(query,queryParams,getCategoryCallback)
}