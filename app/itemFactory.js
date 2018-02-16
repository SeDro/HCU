"use strict";
const fs = require('fs');
const DRIVER_DIRECTORY = "drivers";
const BASE_ITEM_DIRECTORY = "app/base_items";

module.exports = class itemFactory {
	constructor() {
		this._drivers = [];
		this.importDirectory(DRIVER_DIRECTORY);
		this.importDirectory(BASE_ITEM_DIRECTORY);
	}
	
	importDirectory(directory) {
		var dirfiles = fs.readdirSync(directory);
		for(var i = 0; i < dirfiles.length; i++) {
			var driverfile_name = dirfiles[i].split(".")[0];
			this._drivers[driverfile_name] = require("../" + directory + "/" + driverfile_name);
		}
	}
	
	createItem(item, store) {
//		console.log('createItem ' + item.ID + " " + item.TYPE + " " + item.Name + " " + item.Description);
		for(var key in this._drivers) {
			if(key == item.TYPE) {
//				console.log("found TYPE");
				return new this._drivers[key](item, store);
			}
		}
	}
}
