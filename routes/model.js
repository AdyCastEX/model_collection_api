var shared = require('../app.js')

var throwSQLError = shared.throwSQLError
var sendSQLResults = shared.sendSQLResults

var query = ''
var queryParams = []

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
		req.conn.release
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