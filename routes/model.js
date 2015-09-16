var shared = require('../app.js')
var utils = require('../helpers/utils.js')
var db = require('../helpers/db.js')
var err = require('../helpers/error.js')

var query = ''
var queryParams = []

exports.listModels = function(req,res,next){
	var category = req.params.category
	var categoryId

	//save the request and response objects as attributes of the throwError() function so that they can be accessed within its function call
	db.throwError.req = req
	db.throwError.res = res

	var getOtherCategory = function(){
		//find the id of the 'other' category
		query = 'SELECT id FROM category WHERE name = ?'
		queryParams = []
		queryParams.push(category)
		return req.conn.query(query,queryParams)
	}

	var getSpecificModels = function(){
		//find all models that fall under a particular category
		query = 'SELECT * FROM model INNER JOIN ?? ON model.id = ' + category + '.model_id'
		queryParams = []
		queryParams.push(category)
		return req.conn.query(query,queryParams)
	}

	var getModels = function(rows,fields){
		//get the categoryId from the result of the previous query
		categoryId = rows[0]['id']
		//join the model and its category and select all the models that fall under the specified category
		query = 'SELECT * FROM model INNER JOIN model_has_category ON model.id = model_has_category.model_id WHERE model_has_category.category_id = ?'
		queryParams = []
		queryParams.push(categoryId)
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(200)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	//model does not fall under a specific category
	if(category === 'other'){
		getOtherCategory()
			.then(getModels)
			.done(sendResults,db.throwError)
	} else{
		getSpecificModels()
			.done(sendResults,db.throwError)
	}

}

exports.viewModel = function(req,res,next){
	var modelId = req.params.id
	var modelCategoryId = ''
	var modelCategoryName = ''

	db.throwError.req = req
	db.throwError.res = res

	var getCategory = function(){
		var columns = ['id','name']
		//find the category that the model falls under (will return an empty result if the model does not exist)
		query = 'SELECT ?? FROM category INNER JOIN model_has_category ON category.id = model_has_category.category_id WHERE model_has_category.model_id = ?'
		queryParams = []
		queryParams.push(columns)
		queryParams.push(modelId)
		return req.conn.query(query,queryParams)
	}

	var getModel = function(rows,fields){
		if(rows.length > 0){ //perform processing only if the mode exists
			modelCategoryId = rows[0]['id']
			modelCategoryName = rows[0]['name']

			if(modelCategoryName === 'other'){ //no need to join to specific category table
				query = 'SELECT * FROM model WHERE id = ?'
				queryParams = []
				queryParams.push(modelId)
				return req.conn.query(query,queryParams)
			} else { //join to corresponding category table
				query = 'SELECT * FROM model INNER JOIN ?? ON model.id = ' + modelCategoryName + '.model_id WHERE id = ?'
				queryParams = []
				queryParams.push(modelCategoryName)
				queryParams.push(modelId)
				return req.conn.query(query,queryParams)
			}
		} else { //throw an error state when the model was not found
			res.status(404)
			throw err.generateModelNotFoundError(modelId)
		}
	}

	var sendResults = function(rows,fields){
		res.status(200)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	getCategory()
		.then(getModel)
		.done(sendResults,db.throwError)
			
}

exports.createModel = function(req,res,next){
	var body = req.body
	var modelDetails = {}
	var specificDetails = {}
	var keys
	var values
	var category = body['category']
	var insertId = ''
	var categoryId = ''

	db.throwError.req = req
	db.throwError.res = res

	var getCategory = function(){
		var columns = ['id']
		query = 'SELECT ?? FROM category WHERE name = ?'
		queryParams = []
		queryParams.push(columns)
		queryParams.push(category)
		return req.conn.query(query,queryParams)
	}

	var getColumns = function(rows,fields){
		//assumes the previous promise was findCategory
		categoryId = rows[0]['id']
		if(rows.length > 0){
			//determine the columns of the model table through this SQL query
			query = 'SHOW COLUMNS from model'
			queryParams = []
			return req.conn.query(query,queryParams)
		} else {
			throw err.generateCategoryNotFoundError(category)
		}
	}

	var insertModel = function(rows,fields){
		//map the model details to the values in the request body
		utils.buildDetails(rows,modelDetails,body)
		keys = []
		values = []
		utils.getKeyValues(modelDetails,keys,values)

		//insert the model based on the model details
		query = 'INSERT INTO model (??) VALUES (?)'
		queryParams = []
		queryParams.push(keys)
		queryParams.push(values)
		return req.conn.query(query,queryParams)
	}

	var getSpecificColumns = function(rows,fields){
		//assumes the last promise was insertModel
		insertId = rows.insertId
		query = 'SHOW COLUMNS from ??'
		queryParams = []
		queryParams.push(category)
		return req.conn.query(query,queryParams)
	}

	var insertSpecificModel = function(rows,fields){
		//build the details of specific category
		utils.buildDetails(rows,specificDetails,body)
		//override the NULL model_id field as the id of the last inserted model
		specificDetails['model_id'] = insertId
		keys = []
		values = []
		utils.getKeyValues(specificDetails,keys,values)

		//insert into the specific category table
		query = 'INSERT INTO ?? (??) VALUES (?)'
		queryParams = []
		queryParams.push(category)
		queryParams.push(keys)
		queryParams.push(values)
		return req.conn.query(query,queryParams)
	}

	var insertModelCategory = function(rows,fields){
		//if the category is 'other', the previous promise is assumed to be insertModel 
		if(category === 'other'){
			//assign the insertId since the id of the previous insert can only be accessed here
			insertId = rows.insertId
		}
		//give the model a category by inserting into the model_has_category table
		query = 'INSERT INTO model_has_category (model_id,category_id) VALUES (?,?)'
		queryParams = []
		queryParams.push(insertId)
		queryParams.push(categoryId)
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(201)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	if(category === 'other'){
		getCategory()		
			.then(getColumns)
			.then(insertModel)
			.then(insertModelCategory)
			.done(sendResults,db.throwError) 
	} else {
		getCategory()
			.then(getColumns)
			.then(insertModel)
			.then(getSpecificColumns)
			.then(insertSpecificModel)
			.then(insertModelCategory)
			.done(sendResults,db.throwError) 
	}
	
}

exports.deleteModel = function(req,res,next){
	var modelId = req.params.id
	var category = ''

	db.throwError.req = req
	db.throwError.res = res

	var getCategory = function(){
		//find the category (id and name) of the model to delete 
		query = 'SELECT id, name FROM category INNER JOIN model_has_category ON category.id = model_has_category.category_id WHERE model_has_category.model_id = ?'
		queryParams = []
		queryParams.push(modelId)
		return req.conn.query(query,queryParams)
	}

	var removeSpecificModelOrCategory = function(rows,fields){
		if(rows.length > 0){ //process only if the model exists
			//identify the category name from the result of the previous query (assumes the previous promise was getCategory)
			category = rows[0]['name']

			if(category === 'other'){ //if in 'other' category, go straight to removing the category
				query = 'DELETE FROM model_has_category WHERE model_id = ?'
				queryParams = []
				queryParams.push(modelId)
				return req.conn.query(query,queryParams)
			} else { //else delete the model from the specific category table then remove the category
				query = 'DELETE FROM ?? WHERE model_id = ?'
				queryParams = []
				queryParams.push(category)
				queryParams.push(modelId)
				return req.conn.query(query,queryParams)
							   .then(removeCategory)
			}
		} else {
			throw err.generateModelNotFoundError(modelId)
		}
	}

	var removeCategory = function(rows,fields){
		//remove the category by deleting from the model_has_category table
		query = 'DELETE FROM model_has_category WHERE model_id = ?'
		queryParams = []
		queryParams.push(modelId)
		return req.conn.query(query,queryParams)
	}

	var removeModel = function(rows,fields){
		//delete the model from the model table
		query = 'DELETE FROM ?? WHERE id = ?'
		queryParams = []
		queryParams.push('model')
		queryParams.push(modelId)
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(204)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	getCategory()
		.then(removeSpecificModelOrCategory)
		.then(removeModel)
		.done(sendResults,db.throwError)
}

exports.updateModel = function(req,res,next){
	var body = req.body
	var modelId = req.params.id
	var category = ''
	var modelDetails = {}

	db.throwError.req = req
	db.throwError.res = res

	var getCategory = function(){
		//determine the category of the model
		query = 'SELECT id, name FROM category INNER JOIN model_has_category ON category.id = model_has_category.category_id WHERE model_has_category.model_id = ?'
		queryParams = []
		queryParams.push(modelId)
		return req.conn.query(query,queryParams)
	}

	var getColumns = function(rows,fields){
		//process only if the previous query if the model exists under the found category
		if(rows.length > 0){
			//get the category from the result of the previous query
			category = rows[0]['name']

			if(category === 'other'){ //if the model falls under the 'other' category, get only the columns of the model table
				query = 'SHOW COLUMNS FROM model'
				queryParams = []
				return req.conn.query(query,queryParams)
			} else { //else update the table of the specific model category
				query = 'SHOW COLUMNS FROM ??'
				queryParams = []
				queryParams.push(category)
				return req.conn.query(query,queryParams)
							   .then(updateSpecificModel)
							   .then(getModelColumns)
			}
		} else {
			throw err.generateModelNotFoundError(modelId)
		}
	}

	var updateSpecificModel = function(rows,fields){
		modelDetails = {}
		//build the specific model details to update
		utils.buildDetails(rows,modelDetails,body)
		//update the specific model specified by model_id
		query = 'UPDATE ?? SET ? WHERE model_id = ?'
		queryParams = []
		queryParams.push(category)
		queryParams.push(modelDetails)
		queryParams.push(modelId)
		return req.conn.query(query,queryParams)
	}

	var getModelColumns = function(rows,fields){
		query = 'SHOW COLUMNS FROM model'
		queryParams = []
		return req.conn.query(query,queryParams)
	}

	var updateModel = function(rows,fields){
		modelDetails = {}
		//build the model details to update
		utils.buildDetails(rows,modelDetails,body)
		//update the model
		query = 'UPDATE model SET ? WHERE id = ?'
		queryParams = []
		queryParams.push(modelDetails)
		queryParams.push(modelId)
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(200)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	getCategory()
		.then(getColumns)
		.then(updateModel)
		.done(sendResults,db.throwError)
}

exports.changeCategory = function(req,res,next){
	var modelId = req.params.id
	var newCategoryId = req.params.category_id
	var newCategoryName
	var body = req.body
	var modelDetails = {}
	var categoryId
	var categoryName
	var keys
	var values

	var updateCategoryCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			res.status(200)
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	var insertSpecificModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else { //change the category of the model in the model_has_category table
			query = 'UPDATE model_has_category SET category_id = ? WHERE model_id = ?'
			queryParams = []
			queryParams.push(newCategoryId)
			queryParams.push(modelId)
			req.conn.query(query,queryParams,updateCategoryCallback)
		}
	}

	var getNewCategoryColumnsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else { //build details and insert into the specific table of the new category
			modelDetails = {}
			utils.buildDetails(rows,modelDetails,body)
			modelDetails['model_id'] = modelId
			keys = []
			values = []
			utils.getKeyValues(modelDetails,keys,values)
			query = 'INSERT INTO ?? (??) VALUES (?)'
			queryParams = []
			queryParams.push(newCategoryName)
			queryParams.push(keys)
			queryParams.push(values)
			req.conn.query(query,queryParams,insertSpecificModelCallback)
		}
	}

	var getNewCategoryNameCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else {
			newCategoryName = rows[0]['name']

			if(newCategoryName === 'other'){ //no need to insert into a specific model table
				query = 'UPDATE model_has_category SET category_id = ? WHERE model_id = ?'
				queryParams = []
				queryParams.push(newCategoryId)
				queryParams.push(modelId)
				req.conn.query(query,queryParams,updateCategoryCallback)
			} else { //need to determine what attributes will be inserted
				query = 'SHOW COLUMNS FROM ??'
				queryParams = []
				queryParams.push(newCategoryName)
				req.conn.query(query,queryParams,getNewCategoryColumnsCallback)
			}
		}
	}

	var deleteSpecificModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else { //determine the name of the model's new category
			query = 'SELECT name FROM category WHERE id = ?'
			queryParams = []
			queryParams.push(newCategoryId)
			req.conn.query(query,queryParams,getNewCategoryNameCallback)
		}
	}

	var getCategoryCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else {	
			categoryId = rows[0]['id']
			categoryName = rows[0]['name']

			if(categoryId == newCategoryId){ //no need to perform database processing if the new category is the same as the current one
				res.status = 500
				res.json({
					success : false,
					error : 'CATEGORY_NOT_UPDATED'	
				})
				req.conn.release()
			} else { //perform the necessary changes
				if(categoryName === 'other'){ //if the model will be changed to the 'other' category, there is no need to delete the entry from the model's specific category
					query = 'SELECT name FROM category WHERE id = ?'
					queryParams = []
					queryParams.push(newCategoryId)
					req.conn.query(query,queryParams,getNewCategoryNameCallback)
				} else { //delete the model's entry from its specific table
					query = 'DELETE FROM ?? WHERE model_id = ?'
					queryParams = []
					queryParams.push(categoryName)
					queryParams.push(modelId)
					req.conn.query(query,queryParams,deleteSpecificModelCallback)
				}
			}
		}
	}

	//determine the category of the model
	query = 'SELECT id, name FROM category INNER JOIN model_has_category ON category.id = model_has_category.category_id WHERE model_has_category.model_id = ?'
	queryParams = []
	queryParams.push(modelId)
	req.conn.query(query,queryParams,getCategoryCallback)
}

exports.listCustomModels = function(req,res,next){
	
	var getCustomModelsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	query = 'SELECT * FROM ??'
	queryParams = []
	queryParams.push('custom_model')
	req.conn.query(query,queryParams,getCustomModelsCallback)
}

exports.viewCustomModel = function(req,res,next){
	var customModelId = req.params.id
	var result

	var getComponentsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			//since only one result is expected, set the first index to store the components
			result[0]['components'] = rows
			res.status(200)
			sendSQLResults(res,result)
		}
		req.conn.release()
	}

	var selectCustomModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else {
			if(rows.length > 0){ //process if model exists
				result = rows
				columns = ['id','name','status']
				//get the component models of the custom model
				query = 'SELECT ?? FROM ?? INNER JOIN ?? ON ??.model_id = ??.id WHERE ??.custom_model_id = ?'
				queryParams = []
				queryParams.push(columns)
				queryParams.push('custom_model_composed_of_model')
				queryParams.push('model')
				queryParams.push('custom_model_composed_of_model')
				queryParams.push('model')
				queryParams.push('custom_model_composed_of_model')
				queryParams.push(customModelId)
				req.conn.query(query,queryParams,getComponentsCallback)
			} else { //return an error state if the model was not found
				res.status(404)
				res.json({
					success : false,
					error : 'MODEL_NOT_FOUND'
				})
				req.conn.release()
			}
		}
	}

	//find the model from the custom_model table
	query = 'SELECT * FROM ?? WHERE id = ?'
	queryParams = []
	queryParams.push('custom_model')
	queryParams.push(customModelId)
	req.conn.query(query,queryParams,selectCustomModelCallback)
}

exports.createCustomModel = function(req,res,next){
	var body = req.body
	var modelDetails = {}
	var keys = []
	var values = []
	var components = ''
	var insertId

	if('components' in body){
		components = body.components
	}

	var insertComponentsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			res.status(201)
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	var insertCustomModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else {
			if(components == ''){ //there are no component models to associate with the custom model (components is an array if there are component models)
				sendSQLResults(res,rows)
				req.conn.release()
			} else {
				insertId = rows.insertId
				var numComponents = components.length
				//insert multiple rows in one query
				query = 'INSERT INTO custom_model_composed_of_model (custom_model_id,model_id) VALUES '
				queryParams = []
				//for each value in the components array, add escaped values to the query
				for(var i=0;i<numComponents;i+=1){
					query += '(?,?)'
					//add commas if not the last entry
					if(i != numComponents-1){
						query += ', '
					}
					queryParams.push(insertId)
					queryParams.push(components[i])
				}
				//console.log(query)
				req.conn.query(query,queryParams,insertComponentsCallback)
			}
		}
	}

	var getCustomModelColumnsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else {
			//build the custom model's details
			utils.buildDetails(rows,modelDetails,body)
			keys = []
			values = []
			utils.getKeyValues(modelDetails,keys,values)
			//insert the custom model
			query = 'INSERT INTO custom_model (??) VALUES (?)'
			queryParams = []
			queryParams.push(keys)
			queryParams.push(values)
			req.conn.query(query,queryParams,insertCustomModelCallback)
		}
	}

	//determine the columns/attributes of the custom_model table
	query = 'SHOW COLUMNS FROM custom_model'
	queryParams = []
	req.conn.query(query,queryParams,getCustomModelColumnsCallback)
}

exports.deleteCustomModel = function(req,res,next){
	var customModelId = req.params.id

	var deleteCustomModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			res.status(204)
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	var deleteComponentsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else {
			//delete the custom model
			query = 'DELETE FROM custom_model WHERE id = ?'
			queryParams = []
			queryParams.push(customModelId)
			req.conn.query(query,queryParams,deleteCustomModelCallback)
		}
	}

	//remove the custom model's connections with component models
	query = 'DELETE FROM custom_model_composed_of_model WHERE custom_model_id = ?'
	queryParams = []
	queryParams.push(customModelId)
	req.conn.query(query,queryParams,deleteComponentsCallback)
}

exports.updateCustomModel = function(req,res,next){
	var body = req.body
	var customModelId = req.params.id
	var customModelDetails = {}

	var updateCustomModelCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			res.status(200)
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	var getCustomModelColumnsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
			req.conn.release()
		} else {
			customModelDetails = {}
			utils.buildDetails(rows,customModelDetails,body)

			query = 'UPDATE ?? SET ? WHERE id = ?'
			queryParams = []
			queryParams.push('custom_model')
			queryParams.push(customModelDetails)
			queryParams.push(customModelId)
			req.conn.query(query,queryParams,updateCustomModelCallback)
		}
	}

	query = 'SHOW COLUMNS FROM ??'
	queryParams = []
	queryParams.push('custom_model')
	req.conn.query(query,queryParams,getCustomModelColumnsCallback)
}

exports.editComponents = function(req,res,next){
	var customModelId = req.params.id
	var action = req.params.action
	var components = []

	if('components' in req.body){
		if(req.body.components instanceof Array){
			//if 'components' in the body is an array, remove possible duplicates
			utils.removeDuplicates(req.body.components,components)
		} else {
			//if 'components' is a single value, push the value to the components variable to make it an array
			components.push(req.body.components)
		}
	}

	var length = components.length

	var editComponentsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			res.status(200)
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	if(length > 0){
		if(action === 'add'){
			//to declare a model as a component of the custom_model, insert into the custom_model_composed_of_model table
			query = 'INSERT INTO ?? (custom_model_id,model_id) VALUES '
			queryParams = []
			queryParams.push('custom_model_composed_of_model')
			for(var i=0;i<length;i+=1){
				query += '(?,?)'
				if(i != length-1){
					query += ', '
				}
				queryParams.push(customModelId)
				queryParams.push(components[i])
			}
			//add this line to prevent the entire query from failing when there are duplicate inserts
			query += ' ON DUPLICATE KEY UPDATE model_id = model_id'
			req.conn.query(query,queryParams,editComponentsCallback)
		} else if(action === 'remove'){
			//remove the component entry from the table
			query = 'DELETE FROM ?? WHERE custom_model_id = ? AND model_id IN (?)'
			queryParams = []
			queryParams.push('custom_model_composed_of_model')
			queryParams.push(customModelId)
			queryParams.push(components)
			req.conn.query(query,queryParams,editComponentsCallback)
		} else {
			//respond with an error if anything other than add or remove was set as the action parameter
			res.status = 500
			res.json({
				success : false,
				error : 'INVALID_ACTION'	
			})
			req.conn.release()
		}
	} else {
		//respond with an error if there were no components passed in the request body
		res.status = 500
		res.json({
			success : false,
			error : 'NOTHING_TO_CHANGE'	
		})
		req.conn.release()
	}
}

exports.listModelColumns = function(req,res,next){
	var table = req.params.table

	var getModelColumnsCallback = function(err,rows,fields){
		if(err){
			throwSQLError(err,res)
		} else {
			res.status(200)
			sendSQLResults(res,rows)
		}
		req.conn.release()
	}

	query = 'SHOW COLUMNS FROM ??'
	queryParams = []
	queryParams.push(table)
	req.conn.query(query,queryParams,getModelColumnsCallback)
}	