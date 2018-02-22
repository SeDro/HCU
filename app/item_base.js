"use strict";
module.exports = class item_base {
	constructor(item, store) {
		this.update(item);
		this._store = store;
		this.callbacks = [];
	}
	
	serialize() {
		return {ID: this.ID, TYPE: this.TYPE, Name: this.Name, Description: this.Description};
	}
	
	user_detailed_view() {
		return this.serialize();
	}
	
	dispose() {
		this.callbacks = undefined;
	};
	
	update(item) {
		for(var key in item) {
			this[key] = item[key];
		}
		for(var trigger in this.callbacks) {
			setImmediate(() => {this.callbacks[trigger]()});
		}
		return true;
	}
	
	subscribe(callback) {
		this.callbacks.push(callback);
		var tmp = this.callbacks.length - 1;
		console.log(this.ID + " added callback: " + tmp);
		return () => { 
//				console.log("Remove callback: " + tmp);
				this.callbacks[tmp] = undefined;
			};
	}
}
