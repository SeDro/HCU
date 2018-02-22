"use strict";
const fs = require('fs');
var itemFactory = require('./itemFactory');
var actions = require('./actions');

module.exports = class Store {
	constructor () {
		this.Factory = new itemFactory();
		this._state = [];
		this.callbacks = [];
		this._persistence = [];
		this.loadPersistence();
	}
	
	dispatch(action) {
		switch(action.type) {
			case 'UPDATE_ITEM':
				var item = this._state.find(item => item.ID == action.item.ID && item.TYPE == action.item.TYPE);
				if(typeof item !== undefined) {
					if(item.update(action.item)) {
						var pers_item_index = this._persistence.findIndex(pers_item => pers_item.ID == action.item.ID && pers_item.TYPE == action.item.TYPE);
						var new_pers_item = item.serialize();
						for(var key in this._persistence[pers_item_index]) {
							if(this._persistence[pers_item_index][key] != new_pers_item[key]) {
								this._persistence[pers_item_index] = new_pers_item;
								this.writePersistence();
								break;
							}
						}
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
				this._persistence.push(this._state[this._state.length - 1].serialize());
				this.writePersistence();
				break;
			case 'DELETE_ITEM':
				var index = this._state.findIndex(item => item.ID == action.item.ID && item.TYPE == action.item.TYPE);
				this._state[index].dispose();
				delete this._state[index];
				index = this._persistence.findIndex(item => item.ID == action.item.ID && item.TYPE == action.item.TYPE);
				delete this._persistence[index];
				this.writePersistence();
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
	
	writePersistence() {
//		console.log(JSON.stringify(this._persistence));
		fs.writeFileSync('./configuration/config.json', JSON.stringify(this._persistence), {encoding: 'utf8', mode: 0o666, flag:'w+'});
	}
	
	loadPersistence() {
		if(fs.existsSync('./configuration/config.json')){
			this._persistence = JSON.parse(fs.readFileSync('./configuration/config.json'));
			for(var i = 0; i < this._persistence.length; i++) {
				if(this._persistence[i] !== undefined) {
					this._state.push(this.Factory.createItem(this._persistence[i], this));
				}
			}
		}
	}
}
