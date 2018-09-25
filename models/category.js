/**
 * File Description : Model for all category related database operations
 * 
 **/
 
const pool = require('../helpers/db.js');
 
exports.getCategories = async () => {
     
     let query = 'SELECT * FROM category';
     let queryParams = [];
     
     try{
         return await pool.query(query,queryParams);
     } catch (err){
         console.log(err);
         return err;
     }
}