/*
    File Description : the main controller used to load all controllers and bind them to routes
*/

const express = require('express');
const router = express.Router();

//load each controller as routes and map them to a particular prefix
router.use('/accounts',require('./accounts'));
router.use('/categories',require('./categories'));
router.use('/models',require('./models'));

//set the router as an export that can be used in other files
module.exports = router;