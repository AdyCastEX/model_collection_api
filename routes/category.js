var shared = require('../app.js')

var throwSQLError = shared.throwSQLError
var sendSQLResults = shared.sendSQLResults

var query = ''
var queryParams = []

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
	query = 'SELECT * FROM category'
	queryParams = []
	req.conn.query(query,queryParams,selectCallback)
}