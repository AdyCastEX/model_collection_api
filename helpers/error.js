
exports.generateModelNotFoundError = function(type,modelId){
	var error = new Error('There is no '+ type + ' with id = '+ modelId + ' in the database');
	if(type === 'custom model'){
		error.code = 'CUSTOM_MODEL_NOT_FOUND';
	} else if(type === 'model'){
		error.code = 'MODEL_NOT_FOUND';
	}
	return error;
}

exports.generateCategoryNotFoundError = function(category){
	var error = new Error('Category'+ category +' does not exist');
	error.code = 'CATEGORY_NOT_FOUND';
	return error;
}

exports.generateCategoryAlreadySetError = function(category){
	var error = new Error('The model already falls under the '+ category + ' category');
	error.code = 'CATEGORY_ALREADY_SET';
	return error;
}

exports.generateUserNotFoundError = function(email){
	var error = new Error('There is no activated user with email = ' + email + ' in the database');
	error.code = 'USER_NOT_FOUND';
	return error;
}