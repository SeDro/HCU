"use strict";
var actions = require('./actions');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

class Server{
	constructor(store) {
		this._store = store;
		app.use(bodyParser.json());
		app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});

		app.post('/items', (req, res) => {
			var new_input = req.body;
			this._store.dispatch(actions.updateItem(new_input));
			res.end();
		});
		
		app.get('/items', (req, res) => {
			let output_items = [];
			let defaultTypes = this._store.defaultTypes;
			for(var index = 0; index < this._store.state.length; index ++) {
				var tmp = this._store.state[index];
				if(!defaultTypes.includes(tmp.TYPE)) {
					output_items.push({ TYPE: tmp.TYPE, Name: tmp.Name});
				}
			}
			res.json(output_items);
		});
		
		app.get('/item/:type/:name', (req, res) => {
			var item = this._store.state.find(item => item.TYPE == req.params.type && item.Name == req.params.name);
			if(item !== undefined) {
				res.json(item.user_detailed_view());
			}
			else {
				res.json();
			}
		});

		var server = app.listen(8081, function () {
			var host = server.address().address
			var port = server.address().port
			console.log("Example app listening at http://%s:%s", host, port)
		});
	}
}

module.exports = Server;
