var express = require('express')
var http = require('http')
var bodyParser = require('body-parser')
var account = require('./routes/account.js')
var model = require('./routes/model.js')
var category = require('./routes/category.js')
var middleware = require('./middleware')

var app = express()

app.set('port',5050)
//add middleware that will be used in all endpoints
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(middleware.createConnection)

app.get('/models/lists/:category',model.listModels)
app.get('/models/:id',model.viewModel)
app.post('/models',model.createModel)
app.delete('/models/:id',model.deleteModel)
app.put('/models/:id',model.updateModel)
app.put('/models/:id/categories/:category_id',model.changeCategory)
app.get('/models/columns/:table',model.listModelColumns)

app.get('/custom-models',model.listCustomModels)
app.get('/custom-models/:id',model.viewCustomModel)
app.post('/custom-models',model.createCustomModel)
app.delete('/custom-models/:id',model.deleteCustomModel)
app.put('/custom-models/:id',model.updateCustomModel)
app.put('/custom-models/:id/components',model.editComponents)

app.get('/categories',category.listCategories)

app.get('/accounts/:id',account.viewUser)
app.post('/accounts',account.createUser)
app.delete('/accounts/:id',account.deleteUser)
app.put('/accounts/:id',account.updateUser)
app.get('/accounts/activate/:token',account.activateUser)
app.post('/login',account.login)

http.createServer(app).listen(app.get('port'),function(){
	console.log('Model Collection API Listening on port ' + app.get('port') +'...')
})




