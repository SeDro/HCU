"use strict";
var actions = require('../actions');
var item_base = require('../item_base');

module.exports = class Script extends item_base{
	constructor(item, store) {
		super(item, store);
		this._unsubscribers = [];
		this.active = true;
		this.runner = require("../../user_scripts/" + this.Name);
	}
	
	set active(value) {
		this._active = value;
		if(this._active) {
			for(var i = 0; i < this.Trigger.length; i++) {
				this._unsubscribers.push(this._store.subscribe(this.Trigger[i], () => {this.execute()}));
			}
		}
		else {
			for(var i = 0; i < this._unsubscribers.length; i++) {
				this._unsubscribers[i]();
			}
		}
	}
	
	get active() {
		return this._active;
	}
	
	dispose() {
		this.active = false;
	}
	
	execute() {
		this.runner.run(this._store);
	}

	serialize() {
		var tmp = super.serialize();
		tmp.Trigger = this.Trigger;
		return tmp;
	}
}
