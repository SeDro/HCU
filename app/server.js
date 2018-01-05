"use strict";
class Server{
	constructor(items, eventEmitter) {
		var express = require('express');
		var app = express();
		var bodyParser = require('body-parser');

		app.use(bodyParser.json());

		app.post('/items', function (req, res) {
			var new_input = req.body;
			var found = false;
			for(var i = 0; i < items.length; i ++) {
				if(items[i].ID == new_input.ID && items[i].TYPE == new_input.TYPE && items[i].DIRECTION == new_input.DIRECTION) {
					found = true;
					items[i].New_Battery = new_input.New_Battery;
					items[i].Bit12 = new_input.Bit12;
					items[i].Temp = new_input.Temp;
					items[i].Weak_Battery = new_input.Weak_Battery;
					items[i].Humidity = new_input.Humidity;
					items[i].Humidity_Abs = new_input.Humidity_Abs;
					console.log('Item updated ' + i);
					eventEmitter.emit('Item updated', i);
				}
			}
			if(found == false) {
				items.push(new_input);
				console.log('New item available ' + (items.length-1) + ': ' + new_input.ID + ' - ' + new_input.TYPE);
				console.log('old items:');
				for(var i = 0; i < items.length; i ++) {
					console.log(items[i].ID + ' ' + items[i].TYPE + ' ' + items[i].DIRECTION);
				}
				eventEmitter.emit('New item available', items.length-1);
			}
			res.end();
		});

		var server = app.listen(8081, function () {
			var host = server.address().address
			var port = server.address().port
			console.log("Example app listening at http://%s:%s", host, port)
		});
	}
}

module.exports = Server;
