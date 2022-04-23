const request = require('request');

function Log(text){
	console.dir(text);
}

function RequestBase(){

	let _headers;

	let self = {get, post};

	function _request({url, method, headers, body}, {success, error}){

		method 	= (method == 'POST')? method: 'GET';
		headers = (typeof headers === 'object')? {..._headers, ...headers}: _headers;
		success = (typeof success === 'function')? success: function(){};
		error 	= (typeof error === 'function')? error: function(){};

		request({url, method, headers, form:body}, function(err, reponse, body){
			if(reponse && reponse.statusCode == 200)
				success(JSON.parse(body))
			else{
				error(err, reponse, body)
				Log(`[Bad Request ${reponse? reponse.statusCode: ''}]: ${method} - ${url}`)
			}
		});
	}

	function get({url, headers, body}, callback = {}){
		_request({url, method: 'GET', headers, body}, callback)
	}

	function post({url, headers, body}, callback = {}){
		_request({url, method: 'POST', headers, body}, callback)
	}

	function init(){

		_headers = {'content-type': 'application/json'}

		Object.defineProperties(self, {
			get: {
				get: function(){
					return get;
				}			
			},
			post: {
				get: function(){
					return post;
				}			
			}
		});
	}
	init();

	return self;

}

module.exports = RequestBase;