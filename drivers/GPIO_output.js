"use strict";
var Gpio = require('onoff').Gpio;
var item_base = require('../app/item_base');
var actions = require('../app/actions');

module.exports = class GPIO_output extends item_base {
	constructor(item, store) {
		super(item, store);
		this._GPIO = new Gpio(this.ID, 'out');
	}
	
	set VALUE(value) {
		var tmp = Date.now();
		for(var i = 0; i < this._store.state.length; i++) {
			if(this._store.state[i].TYPE == 'GPIO_push_button') {
				this._store.dispatch(actions.updateItem({ID: this._store.state[i].ID, TYPE: this._store.state[i].TYPE, DATE: tmp}));
			}
		}
		this._GPIO.writeSync(value);
	}
	
	get VALUE() {
		return this._GPIO.readSync();
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
}
