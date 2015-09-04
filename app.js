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

//shared functions
exports.getConnection = function(callback){
	//encapsulate the pool.getConnection() function in another function
	pool.getConnection(function(err,connection){
		callback(err,connection)
	})
}

exports.throwSQLError = function(err,res){
	console.error('There is an error in your SQL Syntax\n',err)
	res.status(500)
	res.json({
		success : false,
		error : err.code
	})	
}

exports.sendSQLResults = function(res,rows){
	res.json({
		success : true,
		error : '',
		result : rows,
		length : rows.length
	})
}

app.set('port',5050)

//import modules
var account = require('./routes/account.js')
var model = require('./routes/model.js')
var category = require('./routes/category.js')
var middleware = require('./middleware')

//add middleware that will be used in all endpoints
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(middleware.createConnection)

app.get('/models/lists/:category',model.listModels)
app.get('/models/:id',model.viewModel)
app.post('/models',model.createModel)
app.delete('/models/:table/:id',model.deleteModel)
app.put('/models/:id',model.updateModel)
app.put('/models/:id/categories/:category_id',model.changeCategory)
app.get('/models/columns/:table',model.listModelColumns)

app.get('/custom-models',model.listCustomModels)
app.get('/custom-models/:id',model.viewCustomModel)
app.post('/custom-models',model.createCustomModel)
app.delete('/custom-models/:id',model.deleteCustomModel)
app.put('/custom-models/:id',model.updateCustomModel)
app.post('/custom-models/:id/components/:action',model.editComponents)

app.get('/categories',category.listCategories)

app.get('/accounts/:id',account.viewAccount)
app.post('/accounts',account.createAccount)

http.createServer(app).listen(app.get('port'),function(){
	console.log('Model Collection API Listening on port ' + app.get('port') +'...')
})




