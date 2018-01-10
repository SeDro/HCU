"use strict";

class Scripts{
	constructor(items, eventEmitter) {
        this.items = items;
		eventEmitter.on('GPIO state changed', function (gpio, value) {
			if(value == 0) {
				var item = items.find(item => item.TYPE == 'GPIO' && item.ID == gpio);

				if(typeof item.DATE !== undefined && item.DATE >= Date.now() - 200) return;

				var output_item;
				switch(item.ID) {
					case '2':
						output_item = items.find(item => item.ID == '17');
						break;
					case '25':
						output_item = items.find(item => item.ID == '23');
						break;
					default:
						console.log("Unknown Input change " + gpio);
				}
				item.DATE = Date.now();
				if(typeof output_item !== undefined && !activateGPIOandSetTimer(output_item)) deactivateGPIO(output_item);
			}
		});
		eventEmitter.on('Item updated', function (index) {
			var tmp = new Date();
			var time = tmp.getHours();
			if(time >= 0 && time <= 3 && items[index].TYPE == 'Humidity/Temp' && items[index].ID == '44') {
				for(var i = 0; i < items.length; i++) {
					if(typeof items[i].Humidity_Abs !== undefined && items[i].Humidity_Abs >= items[index].Humidity_Abs) {
						switch (items[i].ID) {
							case '4':
								activateGPIOandSetTimer(items.find(item => item.ID == '24'));
								break;
							case '60':
								activateGPIOandSetTimer(items.find(item => item.ID == '17'));
								break;
							case '32':
								activateGPIOandSetTimer(items.find(item => item.ID == '23'));
								break;
						}
					}
				}
			}
		});
		eventEmitter.on('Item updated', function (index) {
			if(items[index].TYPE == 'GPIO')
				if (items[index].DIRECTION == 'Output') {
					if(items[index].VALUE !== undefined && items[index].VALUE == '1') activateGPIOandSetTimer(items[index])
					else deactivateGPIO(items[index]);
				} else {
					eventEmitter.emit('GPIO state changed', items[index].ID, items[index].VALUE);
				}
		});

	}
}
function activateGPIOandSetTimer(item) {
	if(item.GPIO.readSync() == 0) {
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
