
exports.generateModelNotFoundError = function(modelId){
	var error = new Error('There is no model with id = '+ modelId + ' in the database')
	error.code = 'MODEL_NOT_FOUND'
	return error
}

exports.generateCategoryNotFoundError = function(category){
	var error = new Error('Category '+ category +' does not exist')
	error.code = 'CATEGORY_NOT_FOUND'
	return error
}