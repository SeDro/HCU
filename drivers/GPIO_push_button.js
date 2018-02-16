"use strict";
var Gpio = require('onoff').Gpio;
var item_base = require('../app/item_base');
var actions = require('../app/actions');

module.exports = class GPIO_push_button extends item_base {
	constructor(item, store, _VALUE = 0) {
		super(item, store);
		this.VALUE = _VALUE;
		console.log("create new GPIO with ID: " + this.ID);
		this._GPIO = new Gpio(this.ID, 'in', 'falling');
		this._GPIO.watch((err, value, gpio) => {
			this.recieveData(err, value, gpio);
		});
	}
	
	recieveData(err, value, gpio) {
			if (err) {
				throw err;
			}
			if(typeof this.DATE !== undefined && this.DATE >= Date.now() - 200) {
				 return;
			}
			console.log("GPIO recieve data ID: " + this.ID + " inbound gpio number: " + gpio);
			this.DATE = Date.now();
			this._store.dispatch(actions.updateItem({ID: this.ID, TYPE: this.TYPE, VALUE: this.VALUE + 1}));
	}
	
	user_detailed_view() {
		var tmp = super.user_detailed_view();
		tmp.VALUE = this.VALUE;
		return tmp;
	}

	dispose() {
		this._GPIO.unexport();
		super.dispose();
	}

	update(item){
		for(var key in item) {
			if(key == 'DATE') {
				this[key] = item[key];
				return false;
			}
		}
		return super.update(item);
	}
}
