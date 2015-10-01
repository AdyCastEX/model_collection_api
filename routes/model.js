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
			throw err.generateModelNotFoundError('model',modelId)
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

		if(category === 'other'){
			return req.conn.query(query,queryParams)
		} else {
			return req.conn.query(query,queryParams)
					.then(getSpecificColumns)
					.then(insertSpecificModel)
		}
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

	getCategory()		
		.then(getColumns)
		.then(insertModel)
		.then(insertModelCategory)
		.done(sendResults,db.throwError) 
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
			throw err.generateModelNotFoundError('model',modelId)
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
			throw err.generateModelNotFoundError('model',modelId)
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

	db.throwError.req = req
	db.throwError.res = res

	var getCategory = function(){
		//determine the category of the model
		query = 'SELECT id, name FROM category INNER JOIN model_has_category ON category.id = model_has_category.category_id WHERE model_has_category.model_id = ?'
		queryParams = []
		queryParams.push(modelId)
		return req.conn.query(query,queryParams)
	}

	var getNewCategoryOrDeleteSpecificModel = function(rows,fields){
		categoryId = rows[0]['id']
		categoryName = rows[0]['name']

		if(categoryId == newCategoryId){ //no need to perform database processing if the new category is the same as the current one
			throw err.generateCategoryAlreadySetError(categoryName)
		} else { //perform the necessary changes
			if(categoryName === 'other'){ //if the model will be changed to the 'other' category, there is no need to delete the entry from the model's specific category
				query = 'SELECT name FROM category WHERE id = ?'
				queryParams = []
				queryParams.push(newCategoryId)
				return req.conn.query(query,queryParams)
			} else { //delete the model's entry from its specific table before finding the name of the new category
				query = 'DELETE FROM ?? WHERE model_id = ?'
				queryParams = []
				queryParams.push(categoryName)
				queryParams.push(modelId)
				return req.conn.query(query,queryParams)
						       .then(getNewCategory)
			}
		}
	}

	var getNewCategory = function(rows,fields){
		//find the name of the new category
		query = 'SELECT name FROM category WHERE id = ?'
		queryParams = []
		queryParams.push(newCategoryId)
		return req.conn.query(query,queryParams)
	}

	var updateCategoryOrGetColumns = function(rows,fields){
		//assumes the last resolution function returned a query promise to get the name of the new category
		newCategoryName = rows[0]['name']

		if(newCategoryName === 'other'){ //no need to insert into a specific model table
			query = 'UPDATE model_has_category SET category_id = ? WHERE model_id = ?'
			queryParams = []
			queryParams.push(newCategoryId)
			queryParams.push(modelId)
			return req.conn.query(query,queryParams)
		} else { //need to determine what attributes will be inserted	
			query = 'SHOW COLUMNS FROM ??'
			queryParams = []
			queryParams.push(newCategoryName)
			return req.conn.query(query,queryParams)
						   .then(insertSpecificModel)
						   .then(updateCategory)
		}
	}

	var insertSpecificModel = function(rows,fields){
		modelDetails = {}
		utils.buildDetails(rows,modelDetails,body)
		modelDetails['model_id'] = modelId
		keys = []
		values = []
		utils.getKeyValues(modelDetails,keys,values)
		//since the model changed to a specific category, there is a need to insert a new entry to specific category
		query = 'INSERT INTO ?? (??) VALUES (?)'
		queryParams = []
		queryParams.push(newCategoryName)
		queryParams.push(keys)
		queryParams.push(values)
		req.conn.query(query,queryParams)
	}

	var updateCategory = function(rows,fields){
		//update the model's category in the model_has_category table
		query = 'UPDATE model_has_category SET category_id = ? WHERE model_id = ?'
		queryParams = []
		queryParams.push(newCategoryId)
		queryParams.push(modelId)
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(200)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	getCategory()
		.then(getNewCategoryOrDeleteSpecificModel)
		.then(updateCategoryOrGetColumns)
		.done(sendResults,db.throwError)
}

exports.listCustomModels = function(req,res,next){
	db.throwError.req = req
	db.throwError.res = res

	var getCustomModels = function(){
		query = 'SELECT * FROM ??'
		queryParams = []
		queryParams.push('custom_model')
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(200)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}
	getCustomModels()
		.done(sendResults,db.throwError)
}

exports.viewCustomModel = function(req,res,next){
	var customModelId = req.params.id
	var result

	db.throwError.req = req
	db.throwError.res = res

	var findCustomModel = function(){
		//find the model from the custom_model table
		query = 'SELECT * FROM ?? WHERE id = ?'
		queryParams = []
		queryParams.push('custom_model')
		queryParams.push(customModelId)
		return req.conn.query(query,queryParams)
	}

	var getComponents = function(rows,fields){
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
			return req.conn.query(query,queryParams)
		} else { //return an error state if the model was not found
			throw err.generateModelNotFoundError('custom model',customModelId)
		}
	}

	var sendResults = function(rows,fields){
		//since only one result is expected, set the first index to store the components
		result[0]['components'] = rows
		res.status(200)
		db.sendSQLResults(res,result)
		req.conn.end()
	}

	findCustomModel()
		.then(getComponents)
		.done(sendResults,db.throwError)
}

exports.createCustomModel = function(req,res,next){
	var body = req.body
	var modelDetails = {}
	var keys = []
	var values = []
	var components = []
	var insertId

	db.throwError.req = req
	db.throwError.res = res

	if('components' in body){
		components = body.components
	}

	var getColumns = function(){
		//determine the columns/attributes of the custom_model table
		query = 'SHOW COLUMNS FROM custom_model'
		queryParams = []
		return req.conn.query(query,queryParams)
	}

	var insertCustomModel = function(rows,fields){
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
		return req.conn.query(query,queryParams)
	}

	var insertComponents = function(rows,fields){
		var numComponents = components.length
		if(numComponents == 0){ //there are no component models to associate with the custom model (components is an array if there are component models)
			res.status(201)
			db.sendSQLResults(res,rows)
			req.conn.end()
		} else {
			insertId = rows.insertId
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
			return req.conn.query(query,queryParams)
						   .then(sendResults)
		}
	}

	var sendResults = function(rows,fields){
		res.status(201)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	getColumns()
		.then(insertCustomModel)
		.done(insertComponents,db.throwError)
}

exports.deleteCustomModel = function(req,res,next){
	var customModelId = req.params.id

	db.throwError.req = req
	db.throwError.res = res

	var removeComponents = function(){
		//remove the custom model's connections with component models
		query = 'DELETE FROM custom_model_composed_of_model WHERE custom_model_id = ?'
		queryParams = []
		queryParams.push(customModelId)
		return req.conn.query(query,queryParams)
	}

	var removeCustomModel = function(rows,fields){
		//delete the custom model
		query = 'DELETE FROM custom_model WHERE id = ?'
		queryParams = []
		queryParams.push(customModelId)
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(204)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	removeComponents()
		.then(removeComponents)
		.then(removeCustomModel)
		.done(sendResults,db.throwError)
}

exports.updateCustomModel = function(req,res,next){
	var body = req.body
	var customModelId = req.params.id
	var customModelDetails = {}

	db.throwError.req = req
	db.throwError.res = res

	var getColumns = function(){
		query = 'SHOW COLUMNS FROM ??'
		queryParams = []
		queryParams.push('custom_model')
		return req.conn.query(query,queryParams)
	}

	var editCustomModel = function(rows,fields){
		customModelDetails = {}
		utils.buildDetails(rows,customModelDetails,body)

		query = 'UPDATE ?? SET ? WHERE id = ?'
		queryParams = []
		queryParams.push('custom_model')
		queryParams.push(customModelDetails)
		queryParams.push(customModelId)
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(200)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	getColumns()
		.then(editCustomModel)
		.done(sendResults,db.throwError)
}

exports.editComponents = function(req,res,next){
	var body = req.body
	var modelId = req.params.id
	var newComponents = [] 
	var currentComponents = []
	var newComponentsCount = 0
	var currentComponentsCount = 0 

	db.throwError.req = req
	db.throwError.res = res

	var getComponents = function(){
		//get the component models that are already associated with the custom model
		query = 'SELECT ?? FROM ?? WHERE custom_model_id = ?'
		queryParams = []
		queryParams.push('model_id')
		queryParams.push('custom_model_composed_of_model')
		queryParams.push(modelId)
		return req.conn.query(query,queryParams)
	}

	var deleteCurrentComponents = function(rows,fields){
		var numRows = rows.length
		
		//convert the array of rows containing model ids to an array of model ids
		for(var i=0;i<numRows;i+=1){
			currentComponents.push(rows[i]['model_id'])
		}

		//any components value in the body that is not an array is ignored (newComponents is left empty)
		if(body['components'] instanceof Array){
			newComponents = body['components']
		}
		
		//remove the components common to currentComponents and newComponents since there is no need to modify them
		utils.removeArrayIntersection(currentComponents,newComponents)
		//get the new lengths after common components are removed
		currentComponentsCount = currentComponents.length
		newComponentsCount = newComponents.length

		if(currentComponentsCount > 0){
			//delete the components that used to be linked to a custom model (those not included in the new components array)
			query = 'DELETE FROM ?? WHERE custom_model_id = ? AND model_id IN (?)'
			queryParams = []
			queryParams.push('custom_model_composed_of_model')
			queryParams.push(modelId)
			queryParams.push(currentComponents)
			return req.conn.query(query,queryParams)
		} else {
			//if there is nothing to delete, try to delete a nonexistent row to preserve the promise chain
			query = 'DELETE FROM custom_model_composed_of_model WHERE custom_model_id = -1'
			queryParams = []
			return req.conn.query(query,queryParams)
		}
	}

	var addNewComponents = function(rows,fields){
		if(newComponentsCount > 0){ //insert rows if there are components to insert
			query = 'INSERT INTO ?? (custom_model_id,model_id) VALUES'
			queryParams = []
			queryParams.push('custom_model_composed_of_model')
			for(var i=0;i<newComponentsCount;i+=1){
				query += '(?,?)'
				if(i != newComponentsCount-1){
					query += ','
				}
				queryParams.push(modelId)
				queryParams.push(newComponents[i])
			}
			return req.conn.query(query,queryParams)
						   .then(sendSQLResults)
		} else { //send the results and end the connection if there are no components to insert
			res.status(200)
			db.sendResults(res,rows)
			req.conn.end()
		}
	}

	var sendResults = function(rows,fields){
		res.status(200)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}

	getComponents()
		.then(deleteCurrentComponents)
		.done(addNewComponents,db.throwError)
}

exports.listModelColumns = function(req,res,next){
	var table = req.params.table

	db.throwError.req = req
	db.throwError.res = res

	var getModelColumns = function(){
		query = 'SHOW COLUMNS FROM ??'
		queryParams = []
		queryParams.push(table)
		return req.conn.query(query,queryParams)
	}

	var sendResults = function(rows,fields){
		res.status(200)
		db.sendSQLResults(res,rows)
		req.conn.end()
	}
	getModelColumns()
		.done(sendResults,db.throwError)	
}	