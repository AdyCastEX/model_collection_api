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

app.get('/models/lists/:category',middleware.verifyUserSession,model.listModels)
app.get('/models/:id',middleware.verifyUserSession,model.viewModel)
app.post('/models',middleware.verifyUserSession,model.createModel)
app.delete('/models/:id',middleware.verifyUserSession,model.deleteModel)
app.put('/models/:id',middleware.verifyUserSession,model.updateModel)
app.put('/models/:id/categories/:category_id',middleware.verifyUserSession,model.changeCategory)
app.get('/models/columns/:table',middleware.verifyUserSession,model.listModelColumns)

app.get('/custom-models',middleware.verifyUserSession,model.listCustomModels)
app.get('/custom-models/:id',middleware.verifyUserSession,model.viewCustomModel)
app.post('/custom-models',middleware.verifyUserSession,model.createCustomModel)
app.delete('/custom-models/:id',middleware.verifyUserSession,model.deleteCustomModel)
app.put('/custom-models/:id',middleware.verifyUserSession,model.updateCustomModel)
app.put('/custom-models/:id/components',middleware.verifyUserSession,model.editComponents)

app.get('/categories',middleware.verifyUserSession,category.listCategories)

app.get('/accounts/:id',middleware.verifyUserSession,account.viewUser)
app.post('/accounts',account.createUser)
app.delete('/accounts/:id',middleware.verifyUserSession,account.deleteUser)
app.put('/accounts/:id',middleware.verifyUserSession,account.updateUser)
app.get('/accounts/activate/:token',account.activateUser)
app.post('/login',account.login)

http.createServer(app).listen(app.get('port'),function(){
	console.log('Model Collection API Listening on port ' + app.get('port') +'...')
})




