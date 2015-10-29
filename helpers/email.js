var config = require('../config.json');
var P = require('bluebird');
var jade = require('jade');
var juice = require('juice');
var fs = P.promisifyAll(require('fs'));
var path = require('path');
var jwt = P.promisifyAll(require('jsonwebtoken'));
var nodemailer = require('nodemailer');
var mailgun = require('nodemailer-mailgun-transport');

exports.sendActivationEmail = function(userDetails){
	var templateDir = path.join(__dirname,'..','public','templates','activation_email');
	//create a token that will be used for authentication during activation
	var token = jwt.sign(userDetails,config.mailer.secret);
	var htmlTemplate = 'html.jade';
	var styleTemplate = 'style.css';
	var html = '';
	var css = '';
	
	var initializeFiles = function(){
		//options for compiling a jade file
		var options = {
			pretty : true
		}

		//local variables that will be used in the template
		var locals = {
			user_details : {
				name_first : userDetails['name_first'],
				name_last : userDetails['name_last']
			},
			links : {
				activate_url : 'http://' + config.mailer.host + ':' + config.mailer.port + '/accounts/activate/' + token
			}
		}

		//create a jade renderer by compiling the jade template
		var jadeRenderer = jade.compileFile(path.join(templateDir,htmlTemplate),options);
		//generate html from the jade renderer
		html = jadeRenderer(locals);
		//read the css file and return the result as a promise
		return fs.readFileAsync(path.join(templateDir,styleTemplate),'utf-8');
	}

	var sendEmail = function(data){
		//get the contents of the css file in string form and save to the css variable
		css = data;
		//convert the css file to inline css with the html file and set as the email message
		message = juice.inlineContent(html,css);
		//get the mailgun credentials form the config file
		var creds = {
			auth : config.mailer.auth
		}
		//create a promisified nodemailer transport for sending emails
		var mailer = P.promisifyAll(nodemailer.createTransport(mailgun(creds)));
		//set message details as json
		var msg = {
			from : config.mailer.sender,
			to : userDetails['email'],
			subject : 'Please Activate Your Account',
			html : message
		}
		return mailer.sendMail(msg);
	}

	return initializeFiles()
				.done(sendEmail);
}