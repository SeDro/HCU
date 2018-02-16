"use strict";
const fs = require('fs');
var itemFactory = require('./itemFactory');
var actions = require('./actions');

module.exports = class Store {
	constructor () {
		this.Factory = new itemFactory();
		this._state = [];
		this.callbacks = [];
	}
	
	dispatch(action) {
		switch(action.type) {
			case 'UPDATE_ITEM':
				var item = this._state.find(item => item.ID == action.item.ID && item.TYPE == action.item.TYPE);
				if(typeof item !== undefined) {
					if(item.update(action.item)) {
//						console.log(action.type, action.item);
					}
				}
				else {
					this.dispatch(actions.createItem(action.item));
				}
				for(var trigger in this.callbacks) {
					setImmediate(() => {this.callbacks[trigger]()});
				}
				break;
			case 'CREATE_ITEM':
//				console.log(action.type, action.item);
				this._state.push(this.Factory.createItem(action.item, this));
				break;
			default:
		}
	}
	
	get state() {
		return this._state;
	}
	
	dispose() {
		for(var i = 0; i < this._state.length; i++) {
			this._state[i].dispose();
		}
	}
	
	subscribe(trigger, callback) {
		if(trigger.Name !== undefined && trigger.TYPE !== undefined) {
			var item = this._state.find(item => item.Name == trigger.Name && item.TYPE == trigger.TYPE);
			return item.subscribe(callback);
		}
		else {
			this.callbacks.push(callback);
			var tmp = this.callbacks.length - 1;
//			console.log("Added common callback: " + tmp);
			return () => { 
//					console.log("Remove common callback: " + tmp);
					this.callbacks[tmp] = undefined; 
				};
		}
	}
}
