"use strict";
var Timer = [];

class Scripts{
	constructor(items, eventEmitter, GPIOs) {
        this.items = items;
        this.GPIOs = GPIOs;
		eventEmitter.on('GPIO state changed', function (gpio, value) {
			if(value == 0) {
				for(var i = 0; i < items.length; i++) {
					if(items[i].TYPE == 'GPIO' && items[i].ID == gpio) {
						if(typeof items[i].Date !== undefined && items[i].Date >= Date.now() - 200) return;
						items[i].Date = Date.now();
					}
				}
				var _setTimer = false;
				var targetGPIO;
				switch(gpio) {
					case '2':
						targetGPIO = GPIOs['17'];
						break;
					case '25':
						targetGPIO = GPIOs['23'];
						break;
					default:
						console.log("Unknown Input change " + gpio);
				}
	
				var tmp = targetGPIO.readSync();
				_setTimer = tmp == 0;
				targetGPIO.writeSync( tmp ^ 1);
				
				if(_setTimer) Timer[gpio] = setTimeout(deactivateGPIO, 30 * 60 * 1000, targetGPIO);
				else if(typeof Timer[gpio] !== undefined) clearTimeout(Timer[gpio]);
			}
		});
		eventEmitter.on('Item updated', function (index) {
			var tmp = new Date();
			var time = tmp.getHours();
			if(time >= 0 && time <= 3 && items[index].TYPE == 'Humidity/Temp') {
				if(items[index].ID == '44') {
					console.log('aussen updated to '+items[index].Humidity_Abs);
					for(var i = 0; i < items.length; i++) {
						if(typeof items[i].Humidity_Abs != undefined) {
							if(items[i].ID == '4' && items[i].Humidity_Abs >= items[index].Humidity_Abs) {
								var targetGPIO = GPIOs['24'];
								targetGPIO.writeSync(1);
								if(typeof Timer['4'] !== undefined) clearTimeout(Timer['4']);
								Timer['4'] = setTimeout(deactivateGPIO, 30 * 60 * 1000, targetGPIO);;
							}
							if(items[i].ID == '60' && items[i].Humidity_Abs >= items[index].Humidity_Abs) {
								var targetGPIO = GPIOs['17'];
								targetGPIO.writeSync(1);
								if(typeof Timer['60'] !== undefined) clearTimeout(Timer['60']);
								Timer['60'] = setTimeout(deactivateGPIO, 30 * 60 * 1000, targetGPIO);;
							}
							if(items[i].ID == '32' && items[i].Humidity_Abs >= items[index].Humidity_Abs) {
								var targetGPIO = GPIOs['23'];
								targetGPIO.writeSync(1);
								if(typeof Timer['32'] !== undefined) clearTimeout(Timer['32']);
								Timer['32'] = setTimeout(deactivateGPIO, 30 * 60 * 1000, targetGPIO);;
							}
						}
					}
				} else {
					var aussen = items.find(function (item) {return item.ID == '44'});
					if(typeof aussen.Humidity_Abs != undefined && aussen.Humidity_Abs <= items[index].Humidity_Abs) {
						console.log(items[index].ID.toString() + 'updated: ' + items[index].Humidity_Abs.toString() + ' aussen: ' + aussen.Humidity_Abs.toString());
						var targetGPIO;
						switch(items[index].ID) {
							case '4':
								targetGPIO = GPIOs['24'];
								console.log('24 activate');
								break;
							case '60':
								targetGPIO = GPIOs['17'];
								console.log('17 activate');
								break;
							case '32':
								targetGPIO = GPIOs['23'];
								console.log('23 activate');
								break;
						}
						console.log('targetGPIO activate');
						targetGPIO.writeSync(1);
						if(typeof Timer[items[index].ID] !== undefined) clearTimeout(Timer[items[index].ID]);
						Timer[items[index].ID] = setTimeout(deactivateGPIO, 30 * 60 * 1000, targetGPIO);;
					}
				}
			}
		});
	}
}

function deactivateGPIO(targetGPIO) {
	targetGPIO.writeSync(0);
}

module.exports = Scripts;
