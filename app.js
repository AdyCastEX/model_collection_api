const express = require('express');

//create a new express app
const app = express();

//set the port to be either the default or 5050
app.set('port', process.env.PORT || 5050);
//accept urlencoded content type
app.use(express.urlencoded({extended : false}));
//accept json content type
app.use(express.json());
//include the controllers in the app
app.use(require('./controllers'));

/*
app.get('/models/lists/:category',middleware.verifyUserSession,model.listModels);
app.get('/models/:id',middleware.verifyUserSession,model.viewModel);
app.post('/models',middleware.verifyUserSession,model.createModel);
app.delete('/models/:id',middleware.verifyUserSession,model.deleteModel);
app.put('/models/:id',middleware.verifyUserSession,model.updateModel);
app.put('/models/:id/categories/:category_id',middleware.verifyUserSession,model.changeCategory);
app.get('/models/columns/:table',middleware.verifyUserSession,model.listModelColumns);

app.get('/custom-models',middleware.verifyUserSession,model.listCustomModels);
app.get('/custom-models/:id',middleware.verifyUserSession,model.viewCustomModel);
app.post('/custom-models',middleware.verifyUserSession,model.createCustomModel);
app.delete('/custom-models/:id',middleware.verifyUserSession,model.deleteCustomModel);
app.put('/custom-models/:id',middleware.verifyUserSession,model.updateCustomModel);
app.put('/custom-models/:id/components',middleware.verifyUserSession,model.editComponents);

app.get('/categories',middleware.verifyUserSession,category.listCategories);

app.get('/accounts/:id',middleware.verifyUserSession,account.viewUser);
app.post('/accounts',account.createUser);
app.delete('/accounts/:id',middleware.verifyUserSession,account.deleteUser);
app.put('/accounts/:id',middleware.verifyUserSession,account.updateUser);
app.get('/accounts/activate/:token',account.activateUser);
app.post('/login',account.login);

app.post('/admin/categories',middleware.verifyAdminSession,category.createCategory);
app.get('/admin/categories/:id',middleware.verifyAdminSession,category.viewCategory);
app.delete('/admin/categories/:id',middleware.verifyAdminSession,category.deleteCategory);
app.put('/admin/categories/:id',middleware.verifyAdminSession,category.updateCategory);
*/

//set the app to listen for requests
app.listen(app.get('port'), () => {
	console.log('Model Collection API Listening on port ' + app.get('port') +'...');
});




