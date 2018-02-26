"use strict";
var actions = require('../actions');
var item_base = require('../item_base');

module.exports = class DATE extends item_base{
	constructor(item, store) {
		super(item, store);
		this._unsubscribers = [];
		var startInterval = 0;
		var date = new Date(Date.now());
		switch(this.Name) {
			case 'Second':
				this.Interval = 1;
				break;
			case 'Minute':
				this.Interval = 60;
				startInterval = 60 - date.getSeconds();
				break;
			case 'Hour':
				this.Interval = 3600;
				startInterval = (60 - date.getMinutes()) * 60;
				break;
			case 'Day':
				this.Interval = 3600 * 24;
				startInterval = (24 - date.getHours()) * 3600;
				break;
		}
		setTimeout(()=> {
			this._store.dispatch(actions.updateItem({ID: this.ID, TYPE: this.TYPE})); },
			startInterval * 1000);
	}

	update(item) {
		super.update(item);
		setTimeout(()=> {
			this._store.dispatch(actions.updateItem({ID: this.ID, TYPE: this.TYPE})); },
			this.Interval * 1000);
		return false;
	}
}
