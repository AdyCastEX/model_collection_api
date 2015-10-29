var unique = require('array-unique');

/*
 	Creates a json object that maps table columns(keys) to attributes(values) in a request body
 	
 	Parameters:

 	rows             -- the resulting rows of an SQL query that fetches a table's column details
 	details          -- the json object that will contain the keys and values
 	body             -- a json object that contains attributes from a request body  
*/
exports.buildDetails = function(rows,details,body){
	var rowLength = rows.length;
	var field;

	for(var i=0;i<rowLength;i+=1){
		//since the row contains more details, get only the field which is the column name
		field = rows[i]['Field'];
		//add the field to the details only if it can be found in the body
		if(field in body){
			if(body[field] === ''){
				//replace blank fields with a null value
				details[field] = null;
			} else {
				//map the column to the corresponding value in the request body
				details[field] = body[field];
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
		keys.push(key);
		values.push(object[key]);
	}
}

/*
	Removes duplicate elements from an array

	Parameters:

	source 			-- the original array (must be homogenous)
	result          -- the resultant array where the duplicates are removed (must be empty before function call)
*/
exports.removeDuplicates = function(source,result){
	source.sort();
	var length = source.length;
	var compareElement = '';
	for(var i=0;i<length;i+=1){
		if(source[i] != compareElement){
			result.push(source[i]);
			compareElement = source[i];
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
	var arr1Cursor = 0;
	var arr2Cursor = 0;
	var arr1Length = arr1.length;
	var arr2Length = arr2.length;
	var intersection = [];
	
	//sort the two arrays so that order would not affect the result 
	//remove duplicates since sets should have distinct elements
	unique(arr1.sort());
	unique(arr2.sort());

	//if either cursor reaches the last index of their respective arrays, stop
	while(arr1Cursor < arr1Length && arr2Cursor < arr2Length){
		if(arr1[arr1Cursor] < arr2[arr2Cursor]){ //the value in arr1 is smaller, a common element may be in the next arr1 index
			arr1Cursor += 1;
		} else if(arr1[arr1Cursor] > arr2[arr2Cursor]){ //the value in arr1 is bigger, a common element may be in the next arr2 index
			arr2Cursor += 1;
		} else {
			//the two compared elements are equal, add to the intersection and move both cursors
			intersection.push(arr1[arr1Cursor]);
			arr1Cursor += 1;
			arr2Cursor += 1;
		}
	}

	return intersection;
}

/*
	Removes the common elements between two arrays (e.g [1,2,4] and [1,2,5] becomes [4] and [5])

	Parameters:

	arr1                 -- the first array
	arr2                 -- the second array

*/

exports.removeArrayIntersection = function(arr1,arr2){
	//get the intersection to remove
	var intersection = exports.arrayIntersection(arr1,arr2);
	var intersectionLength = intersection.length;
	var index1 = 0;
	var index2 = 0;

	for(var i=0;i<intersectionLength;i+=1){
		//find the index of the element to remove
		index1 = arr1.indexOf(intersection[i]);
		index2 = arr2.indexOf(intersection[i]);
		//remove the element from the array, assuming that there is only one instance
		arr1.splice(index1,1);
		arr2.splice(index2,1);
	}
}

/*
	Sorts the fields (key-value pairs) of a JSON object alphabetically in terms of keys
	(e.g {'c':3,'a':1,'d':4,'b':2} becomes {'a':1,'b':2,'c':3,'d':4})

	Parameters:

	obj 				-- the JSON object to sort
*/

exports.sortJSONFields = function(obj){
	var keys = [];
	var currentKey;
	var numKeys;
	var sortedJSON = {};

	//traverse through each key in the object
	for(var key in obj){
		//check if the object has the property specified by key
		if(obj.hasOwnProperty(key)){
			//if it exists push to the array of keys
			keys.push(key);
		}
	}
	numKeys = keys.length;
	//sort the keys alphabetically
	keys.sort();
	//traverse through the keys array such that fields are inserted to sortedJSON in the same order as the keys array
	for(var i=0;i<numKeys;i+=1){
		currentKey = keys[i];
		sortedJSON[currentKey] = obj[currentKey];
	}

	return sortedJSON;
}

/*
	Converts an array of JSON objects into an array of JSON strings

	Parameters:

	arr    				-- the array of JSON objects to convert
*/

exports.stringifyJSONArray = function(arr){
	var arrLength = arr.length;
	var stringifiedArray = [];
	for(var i=0;i<arrLength;i+=1){
		stringifiedArray.push(JSON.stringify(arr[i]));
	}

	return stringifiedArray;
}

/*
	Converts an array of JSON strings into an array of JSON objects

	Parameters:

	arr 				-- the array of JSON strings to convert
*/

exports.parseJSONStringArray = function(arr){
	var arrLength = arr.length;
	var parsedArray = [];
	for(var i=0;i<arrLength;i+=1){
		parsedArray.push(JSON.parse(arr[i]));
	}

	return parsedArray;
}

/*
	Removes the common elements between two JSON arrays (e.g [{'a':1},{'b':2},{'d':4}] and [{'a':1},{'b':2},{'e':5}] becomes [{'d':4}] and [{'e':5}])

	Parameters:

	arr1                 -- the first array
	arr2                 -- the second array
*/

exports.removeJSONArrayIntersection = function(arr1,arr2){
	var arr1Length = arr1.length;
	var arr2Length = arr2.length;
	var newArr1 = [];
	var newArr2 = [];
	var intersection = [];
	var intersectionLength; 
	var index1 = 0;
	var index2 = 0;

	//copy the json objects in arr1 to a new array (newArr1)
	for(var i=0;i<arr1Length;i+=1){
		//sort the fields of each json object in arr1 alphabetically so that the order of fields will not affect comparisons
		newArr1.push(exports.sortJSONFields(arr1[i]));	
	}

	//remove each json object in arr1 so that it becomes fresh storage for the result of the removal of the intersection
	for(var i=0;i<arr1Length;i+=1){
		arr1.splice(0,1);
	}

	for(var i=0;i<arr2Length;i+=1){
		newArr2.push(exports.sortJSONFields(arr2[i]));
	}

	for(var i=0;i<arr2Length;i+=1){
		arr2.splice(0,1);
	}

	//for easier comparison of json objects, convert the arrays of json to arrays of json strings
	newArr1 = exports.stringifyJSONArray(newArr1);
	newArr2 = exports.stringifyJSONArray(newArr2);

	//get the intersection of the two arrays
	intersection = exports.arrayIntersection(newArr1,newArr2);
	intersectionLength = intersection.length;
	
	for(var i=0;i<intersectionLength;i+=1){
		//find the index of the element to remove
		index1 = newArr1.indexOf(intersection[i]);
		index2 = newArr2.indexOf(intersection[i]);
		//remove the element from the array, assuming that there is only one instance
		newArr1.splice(index1,1);
		newArr2.splice(index2,1);
	}

	//convert the arrays back to json objects
	newArr1 = exports.parseJSONStringArray(newArr1);
	newArr2 = exports.parseJSONStringArray(newArr2);

	arr1Length = newArr1.length;
	arr2Length = newArr2.length;

	//push the results to arr1 and arr2 so that the results are passed by reference
	for(var i=0;i<arr1Length;i+=1){
		arr1.push(newArr1[i])
	}

	for(var i=0;i<arr2Length;i+=1){
		arr2.push(newArr2[i]);
	}

}