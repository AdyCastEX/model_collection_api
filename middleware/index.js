var shared = require('../app.js')
var getConnection = shared.getConnection

exports.createConnection = function(req,res,next){
	var connectCallback = function(err,conn){
		if(err){
			console.error('unable to connect\n',err)
			res.status = 500
			res.json({
				success : false,
				error : err.code
			}) 
		} else {
			req.conn = conn
			console.log('connection established with ' + req.ip)
		}
		next()
	}

	getConnection(connectCallback)
}
