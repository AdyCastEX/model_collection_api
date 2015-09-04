/*
 	Creates a json object that maps table columns(keys) to attributes(values) in a request body
 	
 	Parameters:

 	rows             -- the resulting rows of an SQL query that fetches a table's column details
 	details          -- the json object that will contain the keys and values
 	body             -- a json object that contains attributes from a request body  
*/
exports.buildDetails = function(rows,details,body){
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
exports.getKeyValues = function(object,keys,values){
	
	//traverse through all the keys in the object
	for(key in object){
		keys.push(key)
		values.push(object[key])
	}
}

/*
	Removes duplicate elements from an array

	Parameters:

	source 			-- the original array (must be homogenous)
	result          -- the resultant array where the duplicates are removed (must be empty before function call)
*/
exports.removeDuplicates = function(source,result){
	source.sort()
	var length = source.length
	var compareElement = ''
	for(var i=0;i<length;i+=1){
		if(source[i] != compareElement){
			result.push(source[i])
			compareElement = source[i]
		}
	}
}