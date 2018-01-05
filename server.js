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

const GPIOs = [];
var events = require('events');
var eventEmitter = new events.EventEmitter();

for(var i = 0; i < items.length; i++) {
	if(items[i].TYPE == 'GPIO') {
		console.log(items[i].ID + ' get\'s exported');
		if(items[i].DIRECTION == 'Input') {
			GPIOs[items[i].ID] = new Gpio(items[i].ID, 'in', 'both');
			console.log(items[i].ID + ' get\'s watched');
			GPIOs[items[i].ID].watch(function (err, value, gpio) {
				if (err) {
					throw err;
					}
				console.log('Pin ' + gpio + ' Value is ' + value);
				eventEmitter.emit('GPIO state changed', gpio, value);
			});
		} else {
			GPIOs[items[i].ID] = new Gpio(items[i].ID, 'out');
		}
	}
}
var test = new Server(items, eventEmitter);
var scripts = new Scripts(items, eventEmitter, GPIOs);

process.on('SIGINT', function () {
	for(var i = 0; i < items.length; i++) {
		if(items[i].TYPE == 'GPIO') {
			console.log(items[i].ID + " unexported");
			GPIOs[items[i].ID].unexport();
		}
	}
	process.exit();
});
