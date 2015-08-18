var express = require('express')
var http = require('http')
var bodyParser = require('body-parser')
var mysql = require('mysql')

var app = express()

//establish a mysql as a pool
var pool = mysql.createPool({
	host : 'localhost',
	user : 'adycastex',
	password : 'dboverlord12345',
	database : 'modelcollectiondb'
})

//encapsulate the pool.getConnection() function in another function
exports.getConnection = function(callback){
	pool.getConnection(function(err,connection){
		callback(err,connection)
	})
}

//create storage for shared functions
//var shared = {}
//assign the shared storage to the exportable functions 
//module.exports.Share = shared
//add getConnection() to the exportable functions
//shared.getConnection = getConnection 

app.set('port',5050)

//var routes = require('./routes')
var account = require('./routes/account.js')
var model = require('./routes/model.js')
var middleware = require('./middleware')

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(middleware.createConnection)

app.get("/",function(req,res){
	console.log("endpoint")
	res.send("render finished")
})

http.createServer(app).listen(app.get('port'),function(){
	console.log('Model Collection API Listening on port ' + app.get('port') +'...')
})




