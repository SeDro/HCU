// server.js
"use strict";

var Server = require("./app/server.js");
var Scripts = require("./app/scripts.js");
var Gpio = require('onoff').Gpio;
const items = [];
items.push({ ID: '44',  TYPE: 'Humidity/Temp', Name: 'Außen', DIRECTION:'Input'});
items.push({ ID: '4',  TYPE: 'Humidity/Temp', Name: 'Groß', DIRECTION:'Input'});
items.push({ ID: '32',  TYPE: 'Humidity/Temp', Name: 'Spiel', DIRECTION:'Input'});
items.push({ ID: '60',  TYPE: 'Humidity/Temp', Name: 'Waschraum', DIRECTION:'Input'});
items.push({ ID: '2',  TYPE: 'GPIO', Name: 'Waschraum', DIRECTION:'Input'});
items.push({ ID: '25',  TYPE: 'GPIO', Name: 'Sauna', DIRECTION:'Input'});
items.push({ ID: '17',  TYPE: 'GPIO', Name: 'Waschraum', DIRECTION:'Output'});
items.push({ ID: '23',  TYPE: 'GPIO', Name: 'Sauna', DIRECTION:'Output'});
items.push({ ID: '24',  TYPE: 'GPIO', Name: 'Groß', DIRECTION:'Output'});

var events = require('events');
var eventEmitter = new events.EventEmitter();

for(var i = 0; i < items.length; i++) {
	if(items[i].TYPE == 'GPIO') {
		console.log(items[i].ID + ' get\'s exported');
		if(items[i].DIRECTION == 'Input') {
			items[i].GPIO = new Gpio(items[i].ID, 'in', 'both');
			console.log(items[i].ID + ' get\'s watched');
			items[i].GPIO.watch(function (err, value, gpio) {
				if (err) {
					throw err;
					}
				console.log('Pin ' + gpio + ' Value is ' + value);
				eventEmitter.emit('GPIO state changed', gpio, value);
			});
		} else {
			items[i].GPIO = new Gpio(items[i].ID, 'out');
		}
	}
}
var test = new Server(items, eventEmitter);
var scripts = new Scripts(items, eventEmitter);

process.on('SIGINT', function () {
	for(var i = 0; i < items.length; i++) {
		if(items[i].TYPE == 'GPIO') {
			console.log(items[i].ID + " unexported");
			items[i].GPIO.unexport();
		}
	}
	process.exit();
});
