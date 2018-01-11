"use strict";

class Scripts{
	constructor(items, eventEmitter) {
        this.items = items;
		eventEmitter.on('GPIO state changed', function (gpio, value) {
			var item = items.find(item => item.TYPE == 'GPIO' && item.ID == gpio);
			if(typeof item.DATE !== undefined && item.DATE >= Date.now() - 200) return;
			item.DATE = Date.now();
			item.VALUE = value;
			eventEmitter.emit('Item updated', items.indexOf(item));
		});
		eventEmitter.on('Item updated', function (index) {
			var tmp = new Date();
			var time = tmp.getHours();
			if(time >= 0 && time <= 3 && items[index].TYPE == 'Humidity/Temp' && items[index].ID == '44') {
				for(var i = 0; i < items.length; i++) {
					if(typeof items[i].Humidity_Abs !== undefined && items[i].Humidity_Abs >= items[index].Humidity_Abs) {
						switch (items[i].ID) {
							case '4':
								activateGPIOandSetTimer(items.find(item => item.ID == '24'), false);
								break;
							case '60':
								activateGPIOandSetTimer(items.find(item => item.ID == '17'), false);
								break;
							case '32':
								activateGPIOandSetTimer(items.find(item => item.ID == '23'), false);
								break;
						}
					}
				}
			}
		});
		eventEmitter.on('Item updated', function (index) {
			if(items[index].TYPE == 'GPIO')
				if (items[index].DIRECTION == 'Output') {
					if(items[index].VALUE !== undefined && items[index].VALUE == '1') activateGPIOandSetTimer(items[index], true)
					else deactivateGPIO(items[index]);
				} else if(items[index].VALUE == 0) {
					var item;
					switch(items[index].ID) {
						case '2':
							item = items.find(item => item.ID == '17');
							break;
						case '25':
							item = items.find(item => item.ID == '23');
							break;
						default:
							console.log("Unknown Input change " + gpio);
					}
					if(typeof item !== undefined && !activateGPIOandSetTimer(item), false) deactivateGPIO(item);
				}
		});

	}
}
function activateGPIOandSetTimer(item, always) {
	if(item.GPIO.readSync() == 0 || always) {
		item.GPIO.writeSync(1);
		if(typeof item.Timer !== undefined) clearTimeout(item.Timer);
		item.Timer = setTimeout(deactivateGPIO, 30 * 60 * 1000, item);
		return true;
	}
	return false;
}
function deactivateGPIO(item) {
	if(typeof item.Timer !== undefined) clearTimeout(item.Timer);
	item.GPIO.writeSync(0);
}

module.exports = Scripts;
