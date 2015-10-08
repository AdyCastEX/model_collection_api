var unique = require('array-unique')

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

/*
	Gets the intersection of two arrays (based on intersect_safe() in http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript)

	Parameters:

	arr1              -- the first array
	arr2              -- the second array

	Returns :

	intersection      -- an array that contains the result of the array intersection (sorted)
*/

exports.arrayIntersection = function(arr1,arr2){
	var arr1Cursor = 0
	var arr2Cursor = 0
	var arr1Length = arr1.length
	var arr2Length = arr2.length
	var intersection = []
	
	//sort the two arrays so that order would not affect the result 
	//remove duplicates since sets should have distinct elements
	unique(arr1.sort())
	unique(arr2.sort())

	//if either cursor reaches the last index of their respective arrays, stop
	while(arr1Cursor < arr1Length && arr2Cursor < arr2Length){
		if(arr1[arr1Cursor] < arr2[arr2Cursor]){ //the value in arr1 is smaller, a common element may be in the next arr1 index
			arr1Cursor += 1
		} else if(arr1[arr1Cursor] > arr2[arr2Cursor]){ //the value in arr1 is bigger, a common element may be in the next arr2 index
			arr2Cursor += 1
		} else {
			//the two compared elements are equal, add to the intersection and move both cursors
			intersection.push(arr1[arr1Cursor])
			arr1Cursor += 1
			arr2Cursor += 1
		}
	}

	return intersection
}

/*
	Removes the common elements between two arrays (e.g [1,2,4] and [1,2,5] becomes [4] and [5])

	Parameters:

	arr1                 -- the first array
	arr2                 -- the second array

*/

exports.removeArrayIntersection = function(arr1,arr2){
	//get the intersection to remove
	var intersection = exports.arrayIntersection(arr1,arr2)
	var intersectionLength = intersection.length
	var index1 = 0
	var index2 = 0

	for(var i=0;i<intersectionLength;i+=1){
		//find the index of the element to remove
		index1 = arr1.indexOf(intersection[i])
		index2 = arr2.indexOf(intersection[i])
		//remove the element from the array, assuming that there is only one instance
		arr1.splice(index1,1)
		arr2.splice(index2,1)
	}
}